import copy
import unittest
from datetime import date, timedelta
from prototype.generate_dataset import generate_day
from prototype.integrate_daily import integrate
class IntegrationTests(unittest.TestCase):
    def setUp(self):
        self.rows = generate_day(date(2026,10,12)) + generate_day(date(2026,10,13))
    def test_linkage(self):
        states, checkins, summary = integrate(self.rows)
        self.assertEqual(summary["users"], 30)
        self.assertEqual(summary["checkins"], 60)
        for c in checkins:
            for a in c["recommendations"]:
                self.assertEqual(a["assessment_id"], c["assessment"]["id"])
                self.assertEqual(a["evidence_ids"], c["assessment"]["evidence_ids"])
        for state in states.values():
            self.assertEqual(state["checkins"][1]["previous_checkin_id"], state["checkins"][0]["checkin_id"])
    def test_rejected_does_not_create_snapshot(self):
        row = copy.deepcopy(self.rows[0])
        row["inputs"]["quality"] = "rejected"
        row["inputs"]["simulated_observation"] = {"deposit_score":None,"redness_score":None}
        states, records, _ = integrate([row])
        self.assertIsNone(records[0]["snapshot_id"])
        self.assertEqual(states[row["patient_id"]]["snapshots"], [])
        self.assertIn("Q01", [a["rule_id"] for a in records[0]["recommendations"]])
    def test_no_target_leakage(self):
        before = integrate(self.rows)[1]
        changed = copy.deepcopy(self.rows)
        for r in changed:
            r["simulation_targets"] = {"invented": 999}
            r["rule_outputs"] = {"invented": "bad"}
        self.assertEqual(before, integrate(changed)[1])
    def test_duplicate_and_split_rejected(self):
        with self.assertRaises(ValueError):
            integrate([self.rows[0], self.rows[0]])
        changed = copy.deepcopy(self.rows)
        changed[30]["split"] = "test"
        with self.assertRaises(ValueError):
            integrate(changed)
