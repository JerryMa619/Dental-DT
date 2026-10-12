"""Deterministic longitudinal synthetic data; no clinical/image training claims."""
import argparse
import hashlib
import json
import random
from datetime import date, datetime, time, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo
from prototype.advice import evaluate

VERSION = "0.1.0"
EPOCH = date(2026, 10, 6)
USERS = 30

def record(day, index):
    user = f"SYN-{index:03d}"
    seed = int(hashlib.sha256(f"{VERSION}:{day}:{user}".encode()).hexdigest()[:16], 16)
    rng = random.Random(seed)
    trajectory = ("stable", "improving", "worsening", "fluctuating")[index % 4]
    baseline = 0.2 + (index % 6) * 0.1
    step = (day - EPOCH).days
    if trajectory == "improving":
        burden = max(0.05, baseline - 0.01 * step)
    elif trajectory == "worsening":
        burden = min(0.95, baseline + 0.008 * step)
    elif trajectory == "fluctuating":
        burden = max(0.05, min(0.95, baseline + 0.1 * ((step % 7) - 3)))
    else:
        burden = baseline
    quality = "accepted" if rng.random() > 0.15 else "rejected"
    deposit_signal = max(0, min(1, burden + rng.gauss(0, 0.08)))
    redness_signal = max(0, min(1, burden * 0.7 + rng.gauss(0, 0.07)))
    finding = "visible-deposit" if deposit_signal > 0.45 else "none"
    if redness_signal > 0.4:
        finding = "gingival-change"
    symptoms = {"bleeding": rng.random() < burden * 0.35,
                "swelling": False, "breathing_or_swallowing_difficulty": False,
                "ulcer_days": 0}
    local = datetime.combine(day, time(8), ZoneInfo("Europe/London"))
    example_id = f"{day}:{user}"
    split = "train" if index < 21 else "validation" if index < 25 else "test"
    case = {"case_id": example_id, "patient_id": user, "synthetic": True,
            "quality": quality, "symptoms": symptoms, "simulated_finding": finding}
    return {
        "example_id": example_id, "schema_version": VERSION, "synthetic": True,
        "generator_version": VERSION, "patient_id": user, "split": split,
        "captured_at": local.isoformat(), "previous_example_id": f"{day-timedelta(days=1)}:{user}",
        "inputs": {"symptoms": symptoms, "quality": quality,
                   "site": {"tooth_code": "46", "surface": "buccal"},
                   "simulated_observation": {
                       "deposit_score": round(deposit_signal, 4) if quality == "accepted" else None,
                       "redness_score": round(redness_signal, 4) if quality == "accepted" else None},
                   "image_available": False, "geometry_available": False},
        "simulation_targets": {"latent_burden": round(burden, 4),
                               "trajectory": trajectory,
                               "simulated_finding": finding if quality == "accepted" else None},
        "rule_outputs": evaluate(case),
        "label_provenance": "Procedural synthetic targets and draft rules; no clinician labels.",
    }

def generate_day(day):
    return [record(day, i) for i in range(USERS)]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", default=date.today().isoformat())
    parser.add_argument("--output", type=Path, default=Path("datasets/synthetic/daily"))
    args = parser.parse_args()
    day = date.fromisoformat(args.date)
    path = args.output / f"{day}.jsonl"
    contents = "".join(json.dumps(r, sort_keys=True) + "\n" for r in generate_day(day))
    args.output.mkdir(parents=True, exist_ok=True)
    if path.exists() and path.read_text() != contents:
        raise ValueError("Existing daily shard differs; never overwrite silently")
    path.write_text(contents)
    print(f"{path}: {USERS} synthetic records")

if __name__ == "__main__":
    main()
