# Synthetic DDT Data Pipeline v0.1

An executable standard-library Python prototype. Not a scanner, diagnostic model or treatment engine. It accepts synthetic inputs only.

## Run

From repository root:

```bash
python -m prototype.pipeline --session prototype/examples/session-001.json --state output/twin-state.json
python -m prototype.pipeline --session prototype/examples/session-002.json --state output/twin-state.json
python -m unittest discover -s tests -v
```

No dependencies are required for this pipeline; RDF/SHACL tools have separate requirements.

## Demonstrated behaviour

Session 1 accepts tooth 46 occlusal evidence, rejects lingual glare and requests a targeted rescan. Session 2 accepts lingual evidence; occlusal remains explicitly unobserved in the current session. The previous occlusal observation retains its original capture time and source, never being presented as a new healthy finding.

Snapshots are immutable within the state history. Accepted evidence updates only its region. All rejected/missing regions produce repeat-scan records; an entirely unusable session is logged without a snapshot. Scope 'complete-for-requested-regions' means only the submitted targets, not full-mouth coverage.

Stable session IDs and input digests provide idempotency; altered content under an existing ID is rejected. Patient mismatch and out-of-order capture times are rejected. State-file replacement is atomic for a single process, but concurrent writers and production persistence are not implemented.

## Ontology mapping

| JSON record | Draft ontology |
|---|---|
| Session | ScanSession |
| Device and calibration IDs | DentalDevice; session-bound calibration extension pending |
| Region tooth/surface | Tooth / ToothSurface |
| Quality status | QualityAssessment |
| Artifact IDs | DataArtifact references |
| Snapshot | TwinSnapshot |
| Repeat-scan action | Recommendation / RepeatScan |

This is a conceptual mapping, not an RDF exporter. No image data are read or analysed. Quality decisions are supplied in synthetic input, not determined by an algorithm. Artifact IDs are placeholders, not verified files. Symptom assessment, reconstruction, registration, patient UI, actual notifications and disease models are not implemented.

## Validation result

2026-10-12: five unittest cases passed, covering partial-update provenance/immutability, all-bad rejection, idempotency/conflict, patient identity/time ordering and required evidence/synthetic boundary. Two sequential CLI demo runs produced snapshot-1 and snapshot-2 with region-specific repeat-scan instructions.
