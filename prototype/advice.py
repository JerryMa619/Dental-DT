"""Synthetic advice demonstration. Not a clinical decision system."""
import json
from pathlib import Path

SOURCES = {
 "GUM": "https://www.nhs.uk/conditions/gum-disease/",
 "PAIN": "https://www.nhs.uk/symptoms/toothache/",
 "ULCER": "https://www.nhs.uk/conditions/mouth-ulcers/",
}

def evaluate(case):
    if case.get("synthetic") is not True:
        raise ValueError("Synthetic cases only")
    symptoms = case.get("symptoms", {})
    for key in ("bleeding", "swelling", "breathing_or_swallowing_difficulty"):
        if key not in symptoms or type(symptoms[key]) is not bool:
            raise ValueError("Explicit boolean symptom answers required")
    if case.get("quality") not in ("accepted", "rejected", "needs-review"):
        raise ValueError("Explicit quality status required")
    duration = symptoms.get("ulcer_days", 0)
    if type(duration) not in (int, float) or duration < 0:
        raise ValueError("Invalid ulcer duration")
    finding = case.get("simulated_finding", "none")
    if finding not in ("none", "visible-deposit", "gingival-change", "surface-change"):
        raise ValueError("Unknown simulated finding")
    output = {"case_id": case["case_id"], "synthetic": True,
              "protocol_version": "draft-0.1", "review_status": "unreviewed",
              "evidence": [case["case_id"]], "actions": [],
              "diagnosis": "not-performed", "notification": "not-sent"}
    def add(rule, text, source=None):
        output["actions"].append({"rule_id": rule, "text": text,
                                  "source": SOURCES.get(source),
                                  "origin": "guideline-derived draft" if source else "engineering rule"})
    if symptoms["breathing_or_swallowing_difficulty"]:
        output["priority"] = "emergency-review"
        add("E01", "Seek emergency help; do not wait for a scan or dentist notification.", "PAIN")
        return output
    if symptoms["swelling"]:
        output["priority"] = "professional-review"
        add("R01", "Seek professional assessment of reported swelling; urgency needs clinical assessment.", "PAIN")
    if duration > 21:
        output["priority"] = "professional-review"
        add("R02", "Arrange dentist or GP assessment of a mouth ulcer lasting over three weeks.", "ULCER")
    if symptoms["bleeding"]:
        output["priority"] = "professional-review"
        add("R03", "Arrange dental review for reported gum bleeding.", "GUM")
    if case["quality"] != "accepted":
        output.setdefault("priority", "insufficient-data")
        add("Q01", "Repeat the affected scan region; do not infer health from missing data.")
        return output
    if finding in ("visible-deposit", "gingival-change") and not symptoms["swelling"]:
        add("C01", "Use fluoride toothpaste for twice-daily brushing and appropriate daily interdental cleaning.", "GUM")
    if finding == "gingival-change":
        output.setdefault("priority", "professional-review")
        add("R04", "A visible gingival change does not establish its cause; obtain dental assessment.", "GUM")
    if finding == "surface-change":
        output.setdefault("priority", "professional-review")
        add("R05", "Reference-confirm the simulated surface change before drawing conclusions.")
    if not output["actions"]:
        output["priority"] = "no-actionable-simulated-finding"
        add("N01", "No supplied simulated finding; this is not a healthy-mouth conclusion.")
    output.setdefault("priority", "preventive-guidance")
    return output

def follow_up(previous, current):
    if previous["patient_id"] != current["patient_id"]:
        raise ValueError("Follow-up patient mismatch")
    result = evaluate(current)
    result["previous_case_id"] = previous["case_id"]
    result["follow_up_note"] = "Reported/simulated comparison only; no measured recovery or cure claim."
    result["reported_bleeding_change"] = (
        "no-longer-reported" if previous["symptoms"]["bleeding"] and not current["symptoms"]["bleeding"]
        else "still-reported" if current["symptoms"]["bleeding"]
        else "not-reported")
    return result

def main():
    path = Path(__file__).parent / "examples/advice-cases.json"
    cases = json.loads(path.read_text())
    outputs = [evaluate(case) for case in cases]
    outputs.append(follow_up(cases[1], cases[2]))
    print(json.dumps(outputs, indent=2))

if __name__ == "__main__":
    main()
