"""
Phase 16 — Formal Evaluation: Fine-tuned model vs. Groq baseline
====================================================================
Runs the same held-out test set against both your existing /troubleshoot
(Groq) endpoint and your new /custom-ai/troubleshoot (fine-tuned model)
endpoint, and saves both sets of answers side by side for scoring.

USAGE:
    python run_evaluation.py

REQUIRES:
    - Your backend running (local or production — set BASE_URL below)
    - Your Kaggle notebook + ngrok tunnel running (for the fine-tuned model)
    - evaluation_test_set.json in the same folder

OUTPUT:
    evaluation_results.json — both models' raw answers per test case,
    ready for manual scoring against the rubric.
"""

import json
import time
import urllib.request
import urllib.error

BASE_URL = "http://localhost:3000"  # change to your Render URL to test production
TEST_SET_PATH = "evaluation_test_set.json"
OUTPUT_PATH = "evaluation_results.json"


def call_endpoint(path: str, payload: dict) -> dict:
    body = json.dumps(payload).encode()
    req = urllib.request.Request(
        f"{BASE_URL}{path}",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=35) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return {"error": f"HTTP {e.code}: {e.read().decode()[:300]}"}
    except Exception as e:
        return {"error": str(e)}


def main():
    with open(TEST_SET_PATH, encoding="utf-8") as f:
        test_cases = json.load(f)

    results = []

    for case in test_cases:
        print(f"[{case['id']}] {case['symptom'][:60]}...")

        # Call Groq-backed endpoint
        t0 = time.time()
        groq_response = call_endpoint("/troubleshoot", {
            "symptom": case["symptom"],
            "deviceCategory": case["device"],
        })
        groq_latency = round(time.time() - t0, 2)

        # Call fine-tuned model endpoint
        t0 = time.time()
        custom_response = call_endpoint("/custom-ai/troubleshoot", {
            "symptom": case["symptom"],
            "deviceCategory": case["device"],
        })
        custom_latency = round(time.time() - t0, 2)

        results.append({
            "id": case["id"],
            "device": case["device"],
            "symptom": case["symptom"],
            "expected_cause_keywords": case["expected_cause_keywords"],
            "groq": {
                "response": groq_response,
                "latency_seconds": groq_latency,
            },
            "fine_tuned": {
                "response": custom_response,
                "latency_seconds": custom_latency,
            },
            "manual_scoring": {
                "groq_format_adherence": None,
                "groq_grounding_accuracy": None,
                "groq_reference_accuracy": None,
                "fine_tuned_format_adherence": None,
                "fine_tuned_grounding_accuracy": None,
                "fine_tuned_reference_accuracy": None,
                "notes": "",
            },
        })

        time.sleep(1)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\nDone. {len(results)} test cases run, saved to {OUTPUT_PATH}")
    print("Next: open evaluation_results.json and fill in the manual_scoring")
    print("fields for each case using the rubric (see EVALUATION_RUBRIC.md).")


if __name__ == "__main__":
    main()