import json
import shutil
import tempfile
import unittest
from datetime import date, timedelta
from pathlib import Path
from scripts.update_daily import ROOT, update

class DailyUpdateTests(unittest.TestCase):
    def test_append_and_rerun_preserve_history_and_feedback(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory)
            shutil.copytree(ROOT/'datasets', root/'datasets')
            shutil.copy(ROOT/'CHANGELOG.md', root/'CHANGELOG.md')
            daily=root/'datasets/synthetic/daily'
            before={p.name:p.read_bytes() for p in daily.glob('*.jsonl')}
            last=date.fromisoformat(max(p.stem for p in daily.glob('*.jsonl')))
            result=update(root,last+timedelta(days=1))
            self.assertEqual(result['new_records'],30)
            self.assertTrue(all((daily/name).read_bytes()==content for name,content in before.items()))
            new=json.loads((daily/f'{last+timedelta(days=1)}.jsonl').read_text().splitlines()[0])
            self.assertNotIn('adherence_feedback',new)
            all_files={p:p.read_bytes() for p in root.rglob('*') if p.is_file()}
            self.assertEqual(update(root,last+timedelta(days=1))['new_records'],0)
            self.assertTrue(all(p.read_bytes()==content for p,content in all_files.items()))

    def test_conflict_stops_before_append(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory)
            shutil.copytree(ROOT/'datasets', root/'datasets')
            shutil.copy(ROOT/'CHANGELOG.md', root/'CHANGELOG.md')
            daily=root/'datasets/synthetic/daily';paths=sorted(daily.glob('*.jsonl'))
            rows=[json.loads(s) for s in paths[0].read_text().splitlines()]
            rows[0]['patient_id']='OTHER'
            paths[0].write_text(''.join(json.dumps(r)+'\n' for r in rows))
            with self.assertRaisesRegex(ValueError,'Conflicting historical shard'):
                update(root,date.fromisoformat(paths[-1].stem)+timedelta(days=1))
            self.assertEqual(len(list(daily.glob('*.jsonl'))),len(paths))
