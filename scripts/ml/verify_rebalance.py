import json
from collections import Counter

with open("alpaca_dataset.json", encoding="utf-8") as f:
    data = json.load(f)

print(f"Total examples: {len(data)}")

counts = Counter(e["output"] for e in data)
print(f"Unique chunks represented: {len(counts)}")

single_count = sum(1 for c in counts.values() if c == 1)
print(f"Chunks with only 1 example remaining: {single_count}")

distribution = Counter(counts.values())
print(f"Distribution (examples-per-chunk -> how many chunks): {dict(sorted(distribution.items()))}")