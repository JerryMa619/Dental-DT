# Daily Record to DT Integration

Run from repository root:

```bash
python -m prototype.integrate_daily
python -m unittest discover -s tests -v
```

Outputs under output/integrated: all patient state JSON files, checkins.jsonl and summary.json. These reproducible outputs are ignored by Git by default. The repository keeps a summary and one synthetic example under datasets/synthetic/integrated. Rebuild from the daily shards to obtain complete state.

## Integrated chain

Daily record -> synthetic scan session/site -> supplied quality -> accepted observation -> versioned snapshot -> symptom-linked rule assessment -> evidence-linked recommendations.

Rejected acquisitions create no new snapshot, but symptoms, quality, assessment and rescan/review recommendations remain in the patient check-in history. The previous snapshot is linked explicitly. Accepted observations are procedural scores, not images; artifact references are synthetic observation IDs. Snapshots currently reference these records, not measured meshes.

Each check-in records patient/date/split, previous actual check-in, observation/symptom/quality IDs, snapshot IDs, assessment ID and recommendation IDs. Every recommendation links its assessment, evidence IDs, rule/source and site. Snapshot IDs include patient context outside the per-patient state.

The integration recomputes draft advice from simulated observable scores and symptoms; it does not read simulation_targets or stored rule_outputs. Numeric thresholds reproduce the generator's illustrative logic, not validated clinical cut-offs. Neither a rule label nor patient-reported change is a diagnosis.

## Results 2026-10-12

30 synthetic users; 210 daily records; 167 snapshots; 43 rejected/no-snapshot check-ins; 285 draft recommendations. Twenty tests passed. Four integration tests check evidence/history linkage, rejected scans, exclusion of procedural target fields and duplicate/split conflicts.

## Limitations

No clinical detection, real images, calibrated geometry, RDF export or actual notifications. Symptom/advice integration is JSON and ontology-aligned conceptually. Full longitudinal comparison and adherence feedback remain next steps. Output rebuild replaces derived state deterministically; raw daily shards remain unchanged.
