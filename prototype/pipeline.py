"""Synthetic acquisition-to-twin prototype. No clinical detector."""
import argparse
import hashlib
import json
from datetime import datetime
from pathlib import Path

SURFACES = {"buccal", "lingual", "palatal", "occlusal", "incisal", "mesial", "distal"}
STATUSES = {"accepted", "rejected", "needs-review", "missing"}

def timestamp(value):
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        raise ValueError("Timezone-aware timestamp required")
    return parsed

def validate_session(session):
    for key in ("session_id", "patient_id", "device_id", "calibration_id",
                "captured_at", "synthetic", "regions"):
        if key not in session:
            raise ValueError(f"Missing {key}")
    if session["synthetic"] is not True:
        raise ValueError("This prototype accepts synthetic data only")
    timestamp(session["captured_at"])
    if not session["regions"]:
        raise ValueError("At least one target region is required")
    seen = set()
    for region in session["regions"]:
        tooth = str(region["tooth_code"])
        if len(tooth) != 2 or tooth[0] not in "12345678" or tooth[1] not in "12345678":
            raise ValueError("Invalid FDI tooth code")
        if tooth[0] in "5678" and tooth[1] not in "12345":
            raise ValueError("Invalid primary FDI tooth code")
        if region["surface"] not in SURFACES or region["status"] not in STATUSES:
            raise ValueError("Invalid surface or quality status")
        key = (tooth, region["surface"])
        if key in seen:
            raise ValueError("Duplicate region")
        seen.add(key)
        if region["status"] == "accepted" and not region.get("artifact_ids"):
            raise ValueError("Accepted region requires artifact evidence")
        if region["status"] != "accepted" and not region.get("reason"):
            raise ValueError("Unaccepted region requires explanation")

def process(session, state=None):
    validate_session(session)
    state = json.loads(json.dumps(state or {"patient_id": session["patient_id"],
                                            "sessions": [], "snapshots": []}))
    if state["patient_id"] != session["patient_id"]:
        raise ValueError("Patient mismatch")
    digest = hashlib.sha256(json.dumps(session, sort_keys=True).encode()).hexdigest()
    for previous in state["sessions"]:
        if previous["session_id"] == session["session_id"]:
            if previous["input_digest"] != digest:
                raise ValueError("Conflicting content for existing session")
            return state, previous["result"]
    if state["sessions"] and timestamp(session["captured_at"]) <= timestamp(state["sessions"][-1]["captured_at"]):
        raise ValueError("Sessions must arrive in increasing capture-time order")
    accepted = [r for r in session["regions"] if r["status"] == "accepted"]
    blocked = [r for r in session["regions"] if r["status"] != "accepted"]
    result = {"session_id": session["session_id"], "synthetic": True,
              "snapshot_created": bool(accepted), "actions": [],
              "clinical_assessment": "not-performed",
              "scope_note": "Quality status is synthetic input; no image analysis or healthy-mouth conclusion."}
    for region in blocked:
        result["actions"].append({"action": "repeat-scan",
                                  "tooth_code": str(region["tooth_code"]),
                                  "surface": region["surface"],
                                  "reason": region["reason"],
                                  "evidence_session": session["session_id"],
                                  "review_status": "unreviewed"})
    if accepted:
        previous = state["snapshots"][-1] if state["snapshots"] else None
        latest = dict(previous["regions"]) if previous else {}
        for region in accepted:
            key = f'{region["tooth_code"]}:{region["surface"]}'
            latest[key] = {"artifact_ids": region["artifact_ids"],
                           "source_session": session["session_id"],
                           "captured_at": session["captured_at"],
                           "calibration_id": session["calibration_id"]}
        snapshot = {"snapshot_id": f'snapshot-{len(state["snapshots"]) + 1}',
                    "previous_snapshot": previous["snapshot_id"] if previous else None,
                    "patient_id": session["patient_id"], "session_id": session["session_id"],
                    "captured_at": session["captured_at"],
                    "scope": "partial" if blocked else "complete-for-requested-regions",
                    "current_regions": [f'{r["tooth_code"]}:{r["surface"]}' for r in accepted],
                    "unobserved_current_regions": [f'{r["tooth_code"]}:{r["surface"]}' for r in blocked],
                    "regions": latest}
        state["snapshots"].append(snapshot)
        result["snapshot_id"] = snapshot["snapshot_id"]
    state["sessions"].append({"session_id": session["session_id"],
                              "captured_at": session["captured_at"],
                              "input_digest": digest, "result": result})
    return state, result

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--session", required=True, type=Path)
    parser.add_argument("--state", required=True, type=Path)
    args = parser.parse_args()
    session = json.loads(args.session.read_text())
    state = json.loads(args.state.read_text()) if args.state.exists() else None
    state, result = process(session, state)
    args.state.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.state.with_suffix(args.state.suffix + ".tmp")
    temporary.write_text(json.dumps(state, indent=2) + "\n")
    temporary.replace(args.state)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
