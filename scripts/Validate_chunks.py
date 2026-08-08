#!/usr/bin/env python3

#python3 scripts/validate_chunks.py data/knowledge-chunks/
"""
validate_chunks.py
-------------------
Validation gate for AI Troubleshooting Assistant knowledge base JSON files.

Run this on every JSON file (or folder of files) BEFORE it goes into the
seed dataset / pgvector. Catches the same class of bugs we found manually
(truncated content, invented fields, bad enums, duplicate chunk_ids).

USAGE:
    python3 validate_chunks.py path/to/file.json
    python3 validate_chunks.py path/to/folder/            # validates all *.json in folder
    python3 validate_chunks.py file1.json file2.json ...  # multiple files at once (checks cross-file duplicate chunk_ids too)

EXIT CODE:
    0 = no errors (warnings are OK, just review them)
    1 = at least one error found (DO NOT use this data yet)
"""

import json
import sys
import re
from pathlib import Path

REQUIRED_TOP_FIELDS = [
    "chunk_id", "device_category", "brand", "model", "source",
    "page", "content", "embedding", "metadata", "created_at",
]
REQUIRED_METADATA_FIELDS = [
    "symptom", "possible_cause", "solution", "severity",
    "safety_warning", "difficulty",
]
VALID_SEVERITY = {"low", "medium", "high"}
VALID_DIFFICULTY = {"easy", "medium", "hard"}
PLACEHOLDER_VALUES = {"tbd", "n/a", "unknown", "todo", ""}

# Words/patterns that indicate the model cut a field short instead of
# writing it out in full.
TRUNCATION_PATTERNS = [
    re.compile(r"\.\.\.\s*$"),           # ends in "..."
    re.compile(r"…\s*$"),                # ends in unicode ellipsis
    re.compile(r"\betc\.?\s*$", re.I),   # ends in "etc"
]


class Issue:
    def __init__(self, level, chunk_id, file, message):
        self.level = level  # "ERROR" or "WARNING"
        self.chunk_id = chunk_id
        self.file = file
        self.message = message

    def __str__(self):
        return f"[{self.level}] {self.file} :: {self.chunk_id} -> {self.message}"


def load_json_file(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        return None, [Issue("ERROR", "-", path, f"File is not valid JSON: {e}")]
    except Exception as e:
        return None, [Issue("ERROR", "-", path, f"Could not read file: {e}")]

    if not isinstance(data, list):
        return None, [Issue("ERROR", "-", path, "Top-level JSON must be an array of chunk objects")]

    return data, []


def looks_truncated(text):
    if not isinstance(text, str):
        return False
    for pattern in TRUNCATION_PATTERNS:
        if pattern.search(text.strip()):
            return True
    return False


def is_placeholder(value):
    if value is None:
        return False  # null is fine for optional fields like page/embedding
    if isinstance(value, str) and value.strip().lower() in PLACEHOLDER_VALUES:
        return True
    return False


def validate_chunk(chunk, file, index, seen_ids, all_contents):
    issues = []
    cid = chunk.get("chunk_id", f"<missing id, index {index}>")

    # --- Structural checks ---
    if not isinstance(chunk, dict):
        issues.append(Issue("ERROR", cid, file, "Chunk is not a JSON object"))
        return issues

    for field in REQUIRED_TOP_FIELDS:
        if field not in chunk:
            issues.append(Issue("ERROR", cid, file, f"Missing required field: '{field}'"))

    metadata = chunk.get("metadata", {})
    if not isinstance(metadata, dict):
        issues.append(Issue("ERROR", cid, file, "'metadata' must be an object"))
        metadata = {}
    else:
        for field in REQUIRED_METADATA_FIELDS:
            if field not in metadata:
                issues.append(Issue("ERROR", cid, file, f"Missing required metadata field: '{field}'"))

    # --- chunk_id checks ---
    if "chunk_id" in chunk:
        if not chunk["chunk_id"] or not isinstance(chunk["chunk_id"], str):
            issues.append(Issue("ERROR", cid, file, "'chunk_id' must be a non-empty string"))
        elif chunk["chunk_id"] in seen_ids:
            issues.append(Issue("ERROR", cid, file, f"Duplicate chunk_id (also used in {seen_ids[chunk['chunk_id']]})"))
        else:
            seen_ids[chunk["chunk_id"]] = file

    # --- content checks (this is what actually gets embedded) ---
    content = chunk.get("content")
    if isinstance(content, str):
        if len(content.strip()) < 15:
            issues.append(Issue("ERROR", cid, file, "'content' is too short to be useful for retrieval (<15 chars)"))
        if looks_truncated(content):
            issues.append(Issue("ERROR", cid, file, f"'content' appears truncated: \"...{content[-40:]}\""))
        if content in all_contents:
            issues.append(Issue("WARNING", cid, file, "Duplicate 'content' text as another chunk (possible copy-paste error)"))
        else:
            all_contents.add(content)
    elif "content" in chunk:
        issues.append(Issue("ERROR", cid, file, "'content' must be a string"))

    # --- placeholder / fabrication checks ---
    for field in ["brand", "model", "source"]:
        val = chunk.get(field)
        if is_placeholder(val):
            issues.append(Issue("WARNING", cid, file, f"'{field}' is still a placeholder ('{val}') — fill in before using in production citations"))

    if chunk.get("page") is not None and not isinstance(chunk.get("page"), int):
        issues.append(Issue("ERROR", cid, file, "'page' must be an integer or null"))

    # --- embedding checks ---
    embedding = chunk.get("embedding")
    if embedding is not None:
        if not isinstance(embedding, list) or not all(isinstance(x, (int, float)) for x in embedding):
            issues.append(Issue("ERROR", cid, file, "'embedding' must be null or an array of numbers"))

    # --- metadata enum checks ---
    severity = metadata.get("severity")
    if severity is not None and severity not in VALID_SEVERITY:
        issues.append(Issue("ERROR", cid, file, f"'severity' must be one of {sorted(VALID_SEVERITY)}, got '{severity}'"))

    difficulty = metadata.get("difficulty")
    if difficulty is not None and difficulty not in VALID_DIFFICULTY:
        issues.append(Issue("ERROR", cid, file, f"'difficulty' must be one of {sorted(VALID_DIFFICULTY)}, got '{difficulty}'"))

    # --- metadata truncation checks ---
    for field in ["symptom", "possible_cause", "solution"]:
        val = metadata.get(field)
        if isinstance(val, str) and looks_truncated(val):
            issues.append(Issue("ERROR", cid, file, f"metadata.'{field}' appears truncated: \"...{val[-40:]}\""))

    # --- safety warning sanity check ---
    # If content mentions hazard keywords but safety_warning is null, flag for human review.
    hazard_keywords = ["electric", "shock", "fire", "burn", "gas", "explo", "burst", "hot surface", "flame"]
    if isinstance(content, str):
        lowered = content.lower()
        if any(k in lowered for k in hazard_keywords) and not metadata.get("safety_warning"):
            issues.append(Issue("WARNING", cid, file, "content mentions a possible hazard keyword but 'safety_warning' is empty — please double check"))

    return issues


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    # Collect target files (supports files and folders, expands folders to *.json)
    targets = []
    for arg in sys.argv[1:]:
        p = Path(arg)
        if p.is_dir():
            targets.extend(sorted(p.glob("*.json")))
        elif p.is_file():
            targets.append(p)
        else:
            print(f"WARNING: path not found, skipping: {arg}")

    if not targets:
        print("No JSON files found to validate.")
        sys.exit(1)

    all_issues = []
    seen_ids = {}       # chunk_id -> file, tracked ACROSS all files
    all_contents = set()  # tracked across all files
    total_chunks = 0

    for file in targets:
        data, load_issues = load_json_file(file)
        all_issues.extend(load_issues)
        if data is None:
            continue

        for i, chunk in enumerate(data):
            total_chunks += 1
            all_issues.extend(validate_chunk(chunk, str(file), i, seen_ids, all_contents))

    errors = [i for i in all_issues if i.level == "ERROR"]
    warnings = [i for i in all_issues if i.level == "WARNING"]

    print("=" * 70)
    print(f"Validated {len(targets)} file(s), {total_chunks} total chunk(s)")
    print("=" * 70)

    if errors:
        print(f"\n❌ {len(errors)} ERROR(S) — must fix before using this data:\n")
        for issue in errors:
            print(f"  {issue}")

    if warnings:
        print(f"\n⚠️  {len(warnings)} WARNING(S) — review, but not blocking:\n")
        for issue in warnings:
            print(f"  {issue}")

    if not errors and not warnings:
        print("\n✅ All chunks passed validation with no issues.")

    print()
    if errors:
        print("RESULT: FAILED — fix errors above before seeding this data.")
        sys.exit(1)
    else:
        print("RESULT: PASSED (check warnings above if any).")
        sys.exit(0)


if __name__ == "__main__":
    main()