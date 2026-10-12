import copy
import json
import unittest
from pathlib import Path
from prototype.advice import evaluate, follow_up
CASES = json.loads((Path(__file__).resolve().parents[1] / "prototype/examples/advice-cases.json").read_text())
class AdviceTests(unittest.TestCase):
    def test_care_with_provenance(self):
        r = evaluate(CASES[0])
        self.assertEqual(r["actions"][0]["rule_id"], "C01")
        self.assertTrue(r["actions"][0]["source"].startswith("https://www.nhs.uk"))
    def test_bleeding_is_not_home_only(self):
        r = evaluate(CASES[1])
        self.assertEqual(r["priority"], "professional-review")
        self.assertIn("R03", [a["rule_id"] for a in r["actions"]])
    def test_quality_gate(self):
        r = evaluate(CASES[3])
        self.assertEqual([a["rule_id"] for a in r["actions"]], ["Q01"])
    def test_emergency_before_scan(self):
        r = evaluate(CASES[4])
        self.assertEqual([a["rule_id"] for a in r["actions"]], ["E01"])
        self.assertEqual(r["notification"], "not-sent")
    def test_persistent_ulcer(self):
        self.assertIn("R02", [a["rule_id"] for a in evaluate(CASES[5])["actions"]])
    def test_followup_no_cure_claim(self):
        r = follow_up(CASES[1], CASES[2])
        self.assertEqual(r["reported_bleeding_change"], "no-longer-reported")
        wrong = copy.deepcopy(CASES[2])
        wrong["patient_id"] = "other"
        with self.assertRaises(ValueError):
            follow_up(CASES[1], wrong)
    def test_unknown_symptoms_rejected(self):
        bad = copy.deepcopy(CASES[0])
        del bad["symptoms"]["bleeding"]
        with self.assertRaises(ValueError):
            evaluate(bad)
        bad = copy.deepcopy(CASES[0])
        bad["synthetic"] = False
        with self.assertRaises(ValueError):
            evaluate(bad)
