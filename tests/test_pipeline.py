import copy
import json
import unittest
from pathlib import Path
from prototype.pipeline import process

ROOT = Path(__file__).resolve().parents[1]
S1 = json.loads((ROOT / "prototype/examples/session-001.json").read_text())
S2 = json.loads((ROOT / "prototype/examples/session-002.json").read_text())

class PipelineTests(unittest.TestCase):
    def test_partial_update_and_provenance(self):
        first, result = process(S1)
        before = copy.deepcopy(first)
        second, _ = process(S2, first)
        self.assertEqual(first, before)
        latest = second["snapshots"][-1]
        self.assertEqual(latest["regions"]["46:occlusal"]["source_session"], "demo-001")
        self.assertEqual(latest["regions"]["46:lingual"]["source_session"], "demo-002")
        self.assertEqual(latest["current_regions"], ["46:lingual"])
        self.assertEqual(latest["unobserved_current_regions"], ["46:occlusal"])
        self.assertEqual(result["clinical_assessment"], "not-performed")

    def test_all_bad_no_snapshot(self):
        bad = copy.deepcopy(S1)
        for region in bad["regions"]:
            region.update(status="rejected", reason="blur")
        state, result = process(bad)
        self.assertEqual(state["snapshots"], [])
        self.assertFalse(result["snapshot_created"])
        self.assertEqual(len(result["actions"]), 2)

    def test_idempotency_and_conflict(self):
        state, result = process(S1)
        repeated, same = process(S1, state)
        self.assertEqual(state, repeated)
        self.assertEqual(result, same)
        changed = copy.deepcopy(S1)
        changed["calibration_id"] = "other"
        with self.assertRaises(ValueError):
            process(changed, state)

    def test_identity_and_order(self):
        state, _ = process(S1)
        wrong = copy.deepcopy(S2)
        wrong["patient_id"] = "another"
        with self.assertRaises(ValueError):
            process(wrong, state)
        wrong = copy.deepcopy(S2)
        wrong["captured_at"] = S1["captured_at"]
        with self.assertRaises(ValueError):
            process(wrong, state)

    def test_required_evidence_and_synthetic_boundary(self):
        bad = copy.deepcopy(S1)
        bad["regions"][0]["artifact_ids"] = []
        with self.assertRaises(ValueError):
            process(bad)
        bad = copy.deepcopy(S1)
        bad["synthetic"] = False
        with self.assertRaises(ValueError):
            process(bad)

if __name__ == "__main__":
    unittest.main()
