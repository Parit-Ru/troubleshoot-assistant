import json

with open("alpaca_dataset.json", encoding="utf-8") as f:
    data = json.load(f)

print(f"Total examples: {len(data)}")

# Check by full output (more reliable than truncated input prefix,
# which can collide when chunks share the same manual/page header)
unique_outputs = set(entry["output"] for entry in data)
print(f"Unique output answers (≈ unique source chunks): {len(unique_outputs)}")

empty_outputs = [i for i, e in enumerate(data) if not e["output"].strip()]
print(f"Entries with empty output: {len(empty_outputs)}")

# Show how many paraphrases each unique output got, to spot any chunk
# that only got 1 (meaning its paraphrase call failed / was skipped)
from collections import Counter
counts = Counter(entry["output"] for entry in data)
single_count = sum(1 for c in counts.values() if c == 1)
print(f"Unique answers with only 1 example (no successful paraphrasing): {single_count}")
print(f"Average paraphrases per unique answer: {len(data) / len(counts):.1f}")