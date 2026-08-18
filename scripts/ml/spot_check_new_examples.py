import json

with open("alpaca_dataset.json", encoding="utf-8") as f:
    data = json.load(f)

# The rebalance script appended new examples to the end — the last 150
# entries are the new ones (438 total - 288 original = 150 new)
new_examples = data[-150:]

print(f"Showing {len(new_examples)} newly-added examples.\n")

# Print every 10th one so you get a spread across all 30 chunks rather
# than just the first few — faster to spot-check a representative sample
# than read all 150.
for i in range(0, len(new_examples), 10):
    ex = new_examples[i]
    print(f"--- Example {i} ---")
    print(f"Instruction: {ex['instruction']}")
    print(f"Output (first line): {ex['output'].splitlines()[1]}")
    print()