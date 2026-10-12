import copy
import unittest
from datetime import date
from prototype.generate_dataset import record
from prototype.integrate_daily import integrate
from prototype.longitudinal import compare
class LongitudinalTests(unittest.TestCase):
    def rows(self):
        rows = [record(date(2026,10,12),0), record(date(2026,10,13),0)]
        for row in rows:
            row["inputs"]["quality"] = "accepted"
            row["inputs"]["simulated_observation"] = {"deposit_score":0.7,"redness_score":0.6}
        return rows
    def test_change_and_feedback(self):
        rows = self.rows()
        rows[1]["inputs"]["simulated_observation"] = {"deposit_score":0.3,"redness_score":0.2}
        rows[1]["adherence_feedback"] = [{"recommendation_id": rows[0]["example_id"]+":recommendation:0",
                                         "status":"reported-completed","reported_at":rows[1]["captured_at"]}]
        _, checks, _ = integrate(rows)
        self.assertEqual(checks[0]["longitudinal_comparison"]["status"], "no-baseline")
        self.assertEqual(checks[1]["longitudinal_comparison"]["status"], "simulated-indicators-decreased")
        self.assertFalse(checks[1]["adherence_feedback"][0]["verified_execution"])
    def test_missing_not_improvement(self):
        rows = self.rows()
        rows[1]["inputs"]["quality"] = "rejected"
        rows[1]["inputs"]["simulated_observation"] = {"deposit_score":None,"redness_score":None}
        checks = integrate(rows)[1]
        self.assertEqual(checks[1]["longitudinal_comparison"]["status"],"insufficient-data")
    def test_unreported_and_unknown_recommendation(self):
        rows = self.rows()
        self.assertEqual(integrate(rows)[1][1]["adherence_status"], "not-reported")
        rows[1]["adherence_feedback"] = [{"recommendation_id":"wrong","status":"reported-completed",
                                        "reported_at":rows[1]["captured_at"]}]
        with self.assertRaises(ValueError):
            integrate(rows)
    def test_mixed_and_stable(self):
        rows = self.rows()
        checks = integrate(rows)[1]
        self.assertEqual(compare(*checks)["status"],"within-demo-tolerance")
        changed = copy.deepcopy(checks[1])
        changed["observation"]["values"] = {"deposit_score":0.9,"redness_score":0.2}
        self.assertEqual(compare(checks[0],changed)["status"],"mixed")
