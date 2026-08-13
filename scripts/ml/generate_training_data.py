"""
A.1 — Generate LoRA training data from knowledge_chunks
=========================================================

INPUT:  knowledge_chunks.json — exported from your Postgres table.
        Export it with:

            \copy (SELECT device, brand, model, category, symptom,
                   possible_cause, solution, severity, difficulty,
                   estimated_cost, safety_warning, source, page, chunk_id
                   FROM knowledge_chunks) TO 'knowledge_chunks.json'

        (If \copy doesn't give valid JSON directly in your Postgres setup,
        run a SELECT and use `json_agg(row_to_json(t))` instead, or just
        export via Prisma/a small script — either way, this file expects
        a JSON array of objects matching the schema above.)

OUTPUT: alpaca_dataset.json — ready to drop into LLaMA-Factory's data/ folder.
        dataset_info_entry.json — the entry to paste into data/dataset_info.json

WHAT THIS DOES NOT DO:
        It does not invent solutions, causes, or safety warnings. Every
        `output` field is built ONLY from fields already in your knowledge
        base. The only thing generated (via LLM) is alternate phrasings of
        how a user might describe the SAME symptom — the grounded content
        never changes.

REVIEW STEP IS MANDATORY:
        After running this, open alpaca_dataset.json and spot-check a
        sample of entries before training. Bad paraphrases (symptom drift
        that no longer matches the cause/solution) are the #1 way this
        step quietly ruins the fine-tune.
"""

import json
import os
import time
from pathlib import Path

# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------
INPUT_PATH = "knowledge_chunks.json"
OUTPUT_PATH = "alpaca_dataset.json"
DATASET_INFO_OUTPUT_PATH = "dataset_info_entry.json"
PARAPHRASES_PER_CHUNK = 5          # how many symptom variants to generate per chunk
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")  # set this before running
GROQ_MODEL = "openai/gpt-oss-120b"      # llama-3.3-70b-versatile was deprecated by Groq (June 2026) — only used to PARAPHRASE symptoms, not to invent answers


# ---------------------------------------------------------------------------
# STEP 1 — Build the grounded, structured answer (deterministic, no LLM)
# ---------------------------------------------------------------------------
def build_output_answer(chunk: dict) -> str:
    """
    Builds the exact structured answer format from your AI Response Format spec:
    Problem / Possible Cause / Confidence / Solution / Safety / References
    Every value here comes directly from the chunk — nothing is invented.
    """
    device_line = f"{chunk.get('brand', '')} {chunk.get('device_category', '')} {chunk.get('model', '')}".strip()

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
    """
    Builds the 'input' field = what RAG retrieval would hand the model.
    This mirrors what your Groq call receives today, so the fine-tuned
    model learns the SAME grounding behavior, not a shortcut around it.

    If the row has a `chunk_text` field (the raw text your embeddings were
    generated from), that's used as the authoritative retrieved content,
    since it's presumably what your real retrieval pipeline actually
    returns today. Falls back to a reconstructed summary if chunk_text
    is empty.
    """
    device_line = f"{chunk.get('brand', '')} {chunk.get('device_category', '')} {chunk.get('model', '')}".strip()

    header = f"[Retrieved chunk — {chunk.get('source', 'unknown source')}, Page {chunk.get('page', '?')}]\n"

    chunk_text = (chunk.get("chunk_text") or "").strip()
    if chunk_text:
        return header + chunk_text

    # Fallback if chunk_text is empty for this row
    return (
        header +
        f"Device: {device_line}\n"
        f"Symptom: {chunk.get('symptom', '')}\n"
        f"Possible Cause: {chunk.get('possible_cause', '')}\n"
        f"Solution: {chunk.get('solution', '')}\n"
        f"Safety Warning: {chunk.get('safety_warning', 'None')}\n"
        f"Severity: {chunk.get('severity', '')} | Difficulty: {chunk.get('difficulty', '')} "
        f"| Estimated Cost: {chunk.get('estimated_cost', '')}"
    )


# ---------------------------------------------------------------------------
# STEP 2 — Paraphrase the SYMPTOM only, via Groq (optional but recommended)
# ---------------------------------------------------------------------------
def get_symptom_paraphrases(symptom: str, device: str, n: int) -> list[str]:
    """
    Asks Groq to generate n alternate ways a real user might describe this
    exact symptom in a chat box. This does NOT touch cause/solution/safety —
    only the instruction wording changes, so grounding is preserved.
    """
    if not GROQ_API_KEY:
        print("  [!] GROQ_API_KEY not set — skipping paraphrase augmentation, using original symptom only.")
        return [symptom]

    import urllib.request

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
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) FixBot-TrainingDataGen/1.0",
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
            text = data["choices"][0]["message"]["content"]
            text = text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            variants = json.loads(text)
            return [symptom] + variants[:n]
    except Exception as e:
        detail = ""
        if hasattr(e, "read"):
            try:
                detail = f" — {e.read().decode('utf-8')[:300]}"
            except Exception:
                pass
        print(f"  [!] Paraphrase call failed ({e}{detail}) — falling back to original symptom only.")
        return [symptom]


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------
def main():
    if not Path(INPUT_PATH).exists():
        print(f"ERROR: {INPUT_PATH} not found.")
        print("Export your knowledge_chunks table to this filename first (see docstring at top).")
        return

    with open(INPUT_PATH, "r", encoding="utf-8") as f:
        chunks = json.load(f)

    print(f"Loaded {len(chunks)} knowledge chunks.")

    examples = []
    for i, chunk in enumerate(chunks):
        symptom = chunk.get("symptom", "").strip()
        if not symptom:
            print(f"  [!] Skipping chunk {i} — missing symptom field.")
            continue

        device_line = f"{chunk.get('brand', '')} {chunk.get('device_category', '')}".strip()
        output_answer = build_output_answer(chunk)
        input_context = build_input_context(chunk)

        symptom_variants = get_symptom_paraphrases(symptom, device_line, PARAPHRASES_PER_CHUNK)

        for variant in symptom_variants:
            examples.append({
                "instruction": variant,
                "input": input_context,
                "output": output_answer,
            })

        print(f"  [{i+1}/{len(chunks)}] {device_line} — {symptom[:50]}... -> {len(symptom_variants)} examples")
        time.sleep(0.3)  # be polite to the Groq rate limit

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(examples, f, ensure_ascii=False, indent=2)

    dataset_info_entry = {
        "fixbot_troubleshooting": {
            "file_name": OUTPUT_PATH,
            "columns": {
                "prompt": "instruction",
                "query": "input",
                "response": "output",
            },
        }
    }
    with open(DATASET_INFO_OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(dataset_info_entry, f, ensure_ascii=False, indent=2)

    print(f"\nDone. {len(examples)} training examples written to {OUTPUT_PATH}")
    print(f"Dataset registry entry written to {DATASET_INFO_OUTPUT_PATH}")
    print("\nNEXT STEP: manually review a sample of alpaca_dataset.json before training.")
    print("Look specifically for paraphrases that drifted into a DIFFERENT symptom —")
    print("those will teach the model to give a mismatched cause/solution.")


if __name__ == "__main__":
    main()