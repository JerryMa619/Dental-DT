import unittest
from datetime import date, timedelta
from prototype.generate_dataset import generate_day, record
class DatasetTests(unittest.TestCase):
    def test_repeatability_and_ids(self):
        rows = generate_day(date(2026, 10, 12))
        self.assertEqual(rows, generate_day(date(2026, 10, 12)))
        self.assertEqual(len({r["example_id"] for r in rows}), 30)
    def test_patient_split_and_temporal_link(self):
        day = date(2026, 10, 12)
        for a, b in zip(generate_day(day), generate_day(day + timedelta(days=1))):
            self.assertEqual(a["split"], b["split"])
            self.assertEqual(a["example_id"], b["previous_example_id"])
    def test_quality_and_no_real_data(self):
        for offset in range(7):
            for r in generate_day(date(2026, 10, 6) + timedelta(days=offset)):
                self.assertTrue(r["synthetic"])
                self.assertFalse(r["inputs"]["image_available"])
                if r["inputs"]["quality"] == "rejected":
                    self.assertIsNone(r["inputs"]["simulated_observation"]["deposit_score"])
                    self.assertEqual(r["rule_outputs"]["actions"][-1]["rule_id"], "Q01")
    def test_trajectory(self):
        before = record(date(2026, 10, 6), 1)
        later = record(date(2026, 10, 12), 1)
        self.assertLess(later["simulation_targets"]["latent_burden"], before["simulation_targets"]["latent_burden"])
