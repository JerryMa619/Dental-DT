"""Toy longitudinal comparison and explicitly reported adherence."""
from datetime import datetime

def compare(previous, current, tolerance=0.1):
    if tolerance < 0:
        raise ValueError("Tolerance must be non-negative")
    if previous is None:
        return {"status": "no-baseline", "clinical_meaning": "not-established"}
    if previous["patient_id"] != current["patient_id"]:
        raise ValueError("Patient mismatch")
    if previous["observation"]["site"] != current["observation"]["site"]:
        return {"status": "site-mismatch", "clinical_meaning": "not-established"}
    if datetime.fromisoformat(current["captured_at"]) <= datetime.fromisoformat(previous["captured_at"]):
        raise ValueError("Follow-up must be later")
    if not previous["observation"]["available"] or not current["observation"]["available"]:
        return {"status": "insufficient-data",
                "previous_checkin_id": previous["checkin_id"],
                "clinical_meaning": "not-established"}
    metrics = {}
    for name in ("deposit_score", "redness_score"):
        delta = current["observation"]["values"][name] - previous["observation"]["values"][name]
        metrics[name] = {"delta": round(delta, 4),
                         "direction": "increased" if delta > tolerance else
                         "decreased" if delta < -tolerance else "within-demo-tolerance"}
    directions = {m["direction"] for m in metrics.values()}
    status = ("mixed" if "increased" in directions and "decreased" in directions else
              "simulated-indicators-increased" if "increased" in directions else
              "simulated-indicators-decreased" if "decreased" in directions else
              "within-demo-tolerance")
    return {"status": status, "previous_checkin_id": previous["checkin_id"],
            "metrics": metrics, "demo_tolerance": tolerance,
            "clinical_meaning": "not-established",
            "causality": "No claim that advice caused the change."}

def validate_feedback(feedback, previous, current):
    recommendations = {a["recommendation_id"] for a in previous["recommendations"]} if previous else set()
    result = []
    seen = set()
    for item in feedback:
        identifier = item["recommendation_id"]
        if identifier not in recommendations or identifier in seen:
            raise ValueError("Unknown or duplicate prior recommendation")
        seen.add(identifier)
        if item["status"] not in ("reported-completed", "reported-partial", "reported-not-completed", "unknown"):
            raise ValueError("Invalid adherence status")
        when = datetime.fromisoformat(item["reported_at"])
        if when.tzinfo is None or when != datetime.fromisoformat(current["captured_at"]):
            raise ValueError("Feedback must be timestamped at current check-in")
        result.append({**item, "origin": "synthetic-user-report",
                       "verified_execution": False})
    return result
