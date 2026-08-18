"""
Rebalance training data — re-paraphrase the underrepresented chunks
======================================================================
Finds chunks in alpaca_dataset.json that only got 1 example (paraphrase
call failed/returned nothing originally), re-runs paraphrasing just for
those chunks, and appends the new examples to the existing dataset.

REQUIRES:
    - knowledge_chunks.json (from Phase 12 export) in the same folder
    - alpaca_dataset.json (from the original Phase 13 run) in the same folder
    - GROQ_API_KEY set as an environment variable

OUTPUT:
    Overwrites alpaca_dataset.json with the original 288 examples PLUS
    new paraphrases for the 30 previously-underrepresented chunks.
    A backup of the original is saved as alpaca_dataset.backup.json first.
"""

import json
import os
import shutil
import time
import urllib.request
from collections import Counter
from pathlib import Path

KNOWLEDGE_CHUNKS_PATH = "knowledge_chunks.json"
ALPACA_DATASET_PATH = "alpaca_dataset.json"
BACKUP_PATH = "alpaca_dataset.backup.json"
PARAPHRASES_PER_CHUNK = 5
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_MODEL = "openai/gpt-oss-120b"


def get_symptom_paraphrases(symptom: str, device: str, n: int) -> list[str]:
    if not GROQ_API_KEY:
        print("  [!] GROQ_API_KEY not set — skipping.")
        return []

    prompt = (
        f"A user's {device} has this problem: \"{symptom}\"\n\n"
        f"Write {n} different short, natural, casual ways a real person "
        f"(not a technician) might type this same problem into a chat box. "
        f"Vary vocabulary and phrasing but keep the SAME underlying problem — "
        f"do not introduce new symptoms or details. "
        f"Return ONLY a JSON array of {n} strings, nothing else."
    )

    body = json.dumps({
        "model": GROQ_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.8,
    }).encode()

    req = urllib.request.Request(
        "https://api.groq.com/openai/v1/chat/completions",
        data=body,
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) FixBot-Rebalance/1.0",
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
            text = data["choices"][0]["message"]["content"]
            text = text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            return json.loads(text)[:n]
    except Exception as e:
        print(f"  [!] Paraphrase call failed: {e}")
        return []


def build_output_answer(chunk: dict) -> str:
    parts = [
        "## Problem",
        chunk.get("symptom", "").strip(),
        "",
        "## Possible Cause",
        f"- {chunk.get('possible_cause', '').strip()}",
        "",
        "## Confidence",
        "High (matched directly from official documentation)",
        "",
        "## Solution",
        chunk.get("solution", "").strip(),
    ]
    safety = chunk.get("safety_warning", "")
    if safety and safety.strip():
        parts += ["", "## Safety", f"⚠️ {safety.strip()}"]
    source = chunk.get("source", "")
    page = chunk.get("page", "")
    if source:
        ref = f"{source}"
        if page:
            ref += f" — Page {page}"
        parts += ["", "## References", ref]
    return "\n".join(parts)


def build_input_context(chunk: dict) -> str:
    header = f"[Retrieved chunk — {chunk.get('source', 'unknown source')}, Page {chunk.get('page', '?')}]\n"
    chunk_text = (chunk.get("chunk_text") or "").strip()
    if chunk_text:
        return header + chunk_text
    return header + f"Symptom: {chunk.get('symptom', '')}\nPossible Cause: {chunk.get('possible_cause', '')}\nSolution: {chunk.get('solution', '')}"


def main():
    if not Path(KNOWLEDGE_CHUNKS_PATH).exists() or not Path(ALPACA_DATASET_PATH).exists():
        print(f"ERROR: need both {KNOWLEDGE_CHUNKS_PATH} and {ALPACA_DATASET_PATH} in this folder.")
        return

    with open(KNOWLEDGE_CHUNKS_PATH, encoding="utf-8") as f:
        knowledge_chunks = json.load(f)

    with open(ALPACA_DATASET_PATH, encoding="utf-8") as f:
        existing_examples = json.load(f)

    shutil.copy(ALPACA_DATASET_PATH, BACKUP_PATH)
    print(f"Backed up original dataset to {BACKUP_PATH}")

    output_counts = Counter(e["output"] for e in existing_examples)
    underrepresented_outputs = {output for output, count in output_counts.items() if count == 1}

    print(f"Found {len(underrepresented_outputs)} underrepresented chunks out of {len(output_counts)} total.")

    new_examples = []
    matched = 0

    for chunk in knowledge_chunks:
        expected_output = build_output_answer(chunk)
        if expected_output not in underrepresented_outputs:
            continue

        matched += 1
        symptom = chunk.get("symptom", "").strip()
        device_line = f"{chunk.get('brand', '')} {chunk.get('device_category', '')}".strip()
        input_context = build_input_context(chunk)

        print(f"  [{matched}/{len(underrepresented_outputs)}] Re-paraphrasing: {symptom[:50]}...")
        variants = get_symptom_paraphrases(symptom, device_line, PARAPHRASES_PER_CHUNK)

        for variant in variants:
            new_examples.append({
                "instruction": variant,
                "input": input_context,
                "output": expected_output,
            })

        time.sleep(0.3)

    combined = existing_examples + new_examples
    with open(ALPACA_DATASET_PATH, "w", encoding="utf-8") as f:
        json.dump(combined, f, ensure_ascii=False, indent=2)

    print(f"\nDone. Added {len(new_examples)} new examples for {matched} previously-underrepresented chunks.")
    print(f"Dataset grew from {len(existing_examples)} to {len(combined)} total examples.")
    print(f"\nNEXT STEPS:")
    print(f"1. Spot-check the new examples in {ALPACA_DATASET_PATH}")
    print(f"2. Re-upload as a Kaggle Dataset (or update the existing one)")
    print(f"3. Re-run Phase 15 (LoRA training) — same process as before, fresh training run")
    print(f"4. Re-run Phase 16 evaluation to confirm hallucination risk actually dropped")


if __name__ == "__main__":
    main()