"""Manually authored requirements benchmark; not independent clinical ground truth."""
import json
from pathlib import Path
from prototype.advice import evaluate
ROOT = Path(__file__).resolve().parents[1]
def run():
    cases = json.loads((ROOT / "evaluation/scenarios.json").read_text())
    results = []
    for c in cases:
        symptoms = {"bleeding":False,"swelling":False,"breathing_or_swallowing_difficulty":False,"ulcer_days":0}
        symptoms.update(c["symptoms"])
        actual = evaluate({"case_id":c["id"],"synthetic":True,"patient_id":"BENCH-SYN",
                           "quality":c["quality"],"symptoms":symptoms,"simulated_finding":c["finding"]})
        rules = {a["rule_id"] for a in actual["actions"]}
        errors = []
        if actual["priority"] != c["expected_priority"]:
            errors.append("Priority differs from requirement")
        if not set(c.get("required",[])).issubset(rules):
            errors.append("Required action missing")
        if set(c.get("forbidden",[])) & rules:
            errors.append("Forbidden action present")
        if actual["diagnosis"] != "not-performed" or actual["notification"] != "not-sent":
            errors.append("Unexpected clinical or external action")
        results.append({"id":c["id"],"name":c["name"],"passed":not errors,
                        "expected_priority":c["expected_priority"],
                        "actual_priority":actual["priority"],"actual_rules":sorted(rules),"errors":errors})
    return {"version":"0.1.0","synthetic":True,"scenario_count":len(results),
            "passed":sum(r["passed"] for r in results),"failed":sum(not r["passed"] for r in results),
            "limitation":"Manual software-requirement scenarios, not independent clinician labels or clinical accuracy.",
            "results":results}
if __name__ == "__main__":
    r = run()
    (ROOT / "evaluation/report.json").write_text(json.dumps(r,indent=2)+"\n")
    print(json.dumps({"scenarios":r["scenario_count"],"passed":r["passed"],"failed":r["failed"]}))
