"""Integrate procedural daily records with synthetic DT snapshots."""
import argparse
import copy
import hashlib
import json
from pathlib import Path
from prototype.pipeline import process
from prototype.advice import evaluate

def integrate(rows):
    states, checkins, seen, splits = {}, [], set(), {}
    for row in sorted(rows, key=lambda r: (r["captured_at"], r["patient_id"])):
        if row.get("synthetic") is not True:
            raise ValueError("Synthetic records only")
        identity = row["example_id"]
        if identity in seen:
            raise ValueError("Duplicate example ID")
        seen.add(identity)
        user = row["patient_id"]
        if user in splits and splits[user] != row["split"]:
            raise ValueError("Patient split changed")
        splits[user] = row["split"]
        site = row["inputs"]["site"]
        observation_id = f"{identity}:observation"
        symptoms_id = f"{identity}:symptoms"
        quality_id = f"{identity}:quality"
        region = {**site, "status": row["inputs"]["quality"]}
        if region["status"] == "accepted":
            region["artifact_ids"] = [observation_id]
        else:
            region["reason"] = "Synthetic acquisition rejected; signals unavailable."
        session = {"session_id": identity, "patient_id": user, "device_id": "synthetic-device",
                   "calibration_id": f"synthetic-cal-{row['generator_version']}",
                   "captured_at": row["captured_at"], "synthetic": True, "regions": [region]}
        old = states.get(user)
        before_snapshot = old["snapshots"][-1]["snapshot_id"] if old and old["snapshots"] else None
        state, result = process(session, old)
        states[user] = state
        scores = row["inputs"]["simulated_observation"]
        finding = "none"
        if row["inputs"]["quality"] == "accepted":
            if scores["deposit_score"] is None or scores["redness_score"] is None:
                raise ValueError("Accepted observation requires synthetic scores")
            finding = "visible-deposit" if scores["deposit_score"] > 0.45 else "none"
            if scores["redness_score"] > 0.4:
                finding = "gingival-change"
        case = {"case_id": identity, "patient_id": user, "synthetic": True,
                "quality": row["inputs"]["quality"], "symptoms": row["inputs"]["symptoms"],
                "simulated_finding": finding}
        advice = evaluate(case)
        evidence = [symptoms_id, quality_id]
        if region["status"] == "accepted":
            evidence.append(observation_id)
        assessment_id = f"{identity}:assessment"
        for index, action in enumerate(advice["actions"]):
            action.update(recommendation_id=f"{identity}:recommendation:{index}",
                          assessment_id=assessment_id, evidence_ids=evidence.copy(),
                          site=copy.deepcopy(site))
        global_snapshot = f"{user}/{result['snapshot_id']}" if result["snapshot_created"] else None
        previous_global = f"{user}/{before_snapshot}" if before_snapshot else None
        checkin = {"checkin_id": identity, "synthetic": True, "patient_id": user,
                   "split": row["split"], "captured_at": row["captured_at"],
                   "previous_checkin_id": state["sessions"][-2]["session_id"] if len(state["sessions"]) > 1 else None,
                   "session_id": identity, "snapshot_id": global_snapshot,
                   "previous_snapshot_id": previous_global,
                   "symptom_report": {"id": symptoms_id, "values": row["inputs"]["symptoms"]},
                   "quality_record": {"id": quality_id, "status": region["status"]},
                   "observation": {"id": observation_id, "site": site, "values": scores,
                                   "available": region["status"] == "accepted",
                                   "origin": "procedural-simulation; no image artifact"},
                   "assessment": {"id": assessment_id, "type": "synthetic-rule-evaluation",
                                  "evidence_ids": evidence, "diagnosis": "not-performed"},
                   "recommendations": advice["actions"], "priority": advice["priority"],
                   "notification": "not-sent"}
        state.setdefault("checkins", []).append(checkin)
        checkins.append(checkin)
    summary = {"synthetic": True, "users": len(states), "checkins": len(checkins),
               "snapshots": sum(len(s["snapshots"]) for s in states.values()),
               "no_snapshot_checkins": sum(c["snapshot_id"] is None for c in checkins),
               "recommendations": sum(len(c["recommendations"]) for c in checkins),
               "integration_version": "0.1.0",
               "clinical_detection": False, "real_images": False}
    return states, checkins, summary

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, default=Path("datasets/synthetic/daily"))
    parser.add_argument("--output", type=Path, default=Path("output/integrated"))
    args = parser.parse_args()
    paths = sorted(args.input.glob("*.jsonl"))
    if not paths:
        raise ValueError("No daily shards")
    rows = [json.loads(line) for p in paths for line in p.read_text().splitlines() if line.strip()]
    states, checkins, summary = integrate(rows)
    args.output.mkdir(parents=True, exist_ok=True)
    (args.output / "checkins.jsonl").write_text("".join(json.dumps(c, sort_keys=True) + "\n" for c in checkins))
    (args.output / "summary.json").write_text(json.dumps(summary, indent=2) + "\n")
    for user, state in states.items():
        (args.output / f"{user}.json").write_text(json.dumps(state, indent=2) + "\n")
    print(json.dumps(summary, indent=2))

if __name__ == "__main__":
    main()
