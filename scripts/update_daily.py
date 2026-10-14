"""Append missing synthetic days, preserving old bytes, then refresh display data."""
import argparse
import json
from datetime import date, datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo
from prototype.generate_dataset import VERSION, USERS, generate_day
from prototype.integrate_daily import integrate

ROOT = Path(__file__).resolve().parents[1]

def update(root=ROOT, through=None):
    through = through or datetime.now(ZoneInfo('Europe/London')).date()
    base = root / 'datasets/synthetic'
    manifest_path = base / 'manifest.json'
    manifest = json.loads(manifest_path.read_text())
    if (manifest['generator_version'], manifest['schema_version'], manifest['cohort_size'],
        manifest['synthetic'], manifest['timezone']) != (VERSION, VERSION, USERS, True, 'Europe/London'):
        raise ValueError('Unsupported dataset contract')
    paths = sorted((base / 'daily').glob('*.jsonl'))
    if [p.stem for p in paths] != manifest['dates']:
        raise ValueError('Manifest/shard dates disagree')
    old = {p: p.read_bytes() for p in paths}
    rows = []
    for p in paths:
        batch = [json.loads(line) for line in p.read_text().splitlines() if line.strip()]
        expected = generate_day(date.fromisoformat(p.stem))
        if [{k:v for k,v in r.items() if k != 'adherence_feedback'} for r in batch] != expected:
            raise ValueError(f'Conflicting historical shard: {p.name}')
        rows.extend(batch)
    if len(rows) != manifest['total_records'] or manifest['last_updated_date'] != paths[-1].stem:
        raise ValueError('Manifest counts/date disagree')
    last = date.fromisoformat(manifest['last_updated_date'])
    if through < last:
        raise ValueError('Cannot move dataset backwards')
    # Validate integration and supplied feedback before writing new shards.
    integrate(rows)
    added = []
    day = last + timedelta(days=1)
    while day <= through:
        batch = generate_day(day)
        path = base / 'daily' / f'{day}.jsonl'
        with path.open('x') as stream:
            stream.write(''.join(json.dumps(r, sort_keys=True) + '\n' for r in batch))
        # Match the serialized field order on this run and later reruns.
        rows.extend(json.loads(line) for line in path.read_text().splitlines())
        added.append(day.isoformat())
        day += timedelta(days=1)
    states, checks, summary = integrate(rows)
    if any(p.read_bytes() != b for p,b in old.items()):
        raise ValueError('Historical shard modified')
    if added:
        manifest['dates'] += added
        manifest['total_records'] = len(rows)
        manifest['last_updated_date'] = added[-1]
        missed = [d for d in added if d < through.isoformat()]
        if missed:
            manifest['backfilled_dates'] = sorted(set(manifest.get('backfilled_dates', [])) | set(missed))
        manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
        changelog = root / 'CHANGELOG.md'
        entry = (f'\n## {through} — Daily synthetic update\n\n'
                 f'Added {len(added)*USERS} checks across {len(added)} day(s). '
                 f'Total: {len(rows)} checks, {summary["snapshots"]} snapshots, '
                 f'{summary["recommendations"]} draft recommendations. Historical shards preserved. '
                 'Display export rebuilt; no feedback fabricated.\n')
        text = changelog.read_text()
        line, rest = text.split('\n', 1)
        changelog.write_text(line + '\n' + entry + rest)
    target = base / 'integrated'
    target.mkdir(exist_ok=True)
    (target / 'summary.json').write_text(json.dumps(summary, indent=2) + '\n')
    (target / 'example-SYN-000.json').write_text(json.dumps(states['SYN-000'], indent=2) + '\n')
    return {'new_dates': added, 'new_records': len(added)*USERS, 'summary': summary,
            'historical_shards_unchanged': len(old)}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--through', type=date.fromisoformat)
    args = parser.parse_args()
    result = update(through=args.through)
    # Rebuild the public payload even when the raw data are already current.
    import runpy
    runpy.run_module('scripts.export_explorer', run_name='__main__')
    print(json.dumps(result, indent=2))

if __name__ == '__main__':
    main()
