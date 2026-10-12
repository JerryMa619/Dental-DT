# Change Log

## 2026-10-12 — Benchmark and interactive explorer

- Add 12 manually authored requirement scenarios; 11 pass and persistent-pain gap remains explicit.
- Add patient/day replay, data-flow inspectors, ISO entity mappings, ontology relationship view and benchmark results.
- Export current dataset reproducibly; hosted page is a static snapshot, not automatically updated from GitHub.
- Validate script syntax/data; browser QA unavailable.

## 2026-10-12 — Comparison and adherence

- Add separate indicator directions and mixed/insufficient-data outcomes.
- Link user-reported feedback to prior recommendation IDs; missing feedback stays not-reported.
- Refresh derived histories; pass 24 tests. Tolerance is illustrative, not clinical.

## 2026-10-12 — Integrated daily DT histories

- Connect synthetic daily observations, symptoms, quality, snapshots and recommendations.
- Recompute advice from synthetic input rather than procedural targets/stored outputs.
- Preserve rejected check-ins without new snapshots; add evidence IDs and patient-global snapshot references.
- Rebuild 30 patient histories; pass 20 tests. Save reproducible summary and one example history.

## 2026-10-12 — Longitudinal synthetic dataset

- Bootstrap seven daily shards with 30 fictional users each (210 records).
- Add deterministic trajectories, noisy observations, failed acquisitions and draft rule outputs.
- Separate predictors from procedural labels and split by patient.
- Pass 16 tests; no image data or clinical validity claimed.

## 2026-10-12 — Synthetic advice and follow-up

- Add six synthetic scenarios, evidence-linked draft advice and symptom follow-up.
- Add home ontology extension with symptom, protocol, review, follow-up and notification concepts.
- Pass 12 combined tests and extension syntax parsing.
- Advice module remains separate from persistence; no actual detections or messages.

## 2026-10-12 — Executable synthetic pipeline

- Implement region-based acceptance, immutable state snapshots, provenance and repeat-scan actions.
- Add identity/time checks and idempotent session replay with conflict rejection.
- Pass five tests and sequential CLI demo; quality is supplied, no disease detection implemented.

## 2026-10-12 — Acquisition specification

- Map the first three capability candidates to acquisition data and reference tests.
- Define regional coverage, quality feedback, session-bound calibration and change uncertainty.
- Specify bench-to-clinical feasibility gates and metric definitions; performance thresholds remain TBD.

## 2026-10-12 — Home detection and advice requirements

- Record corrected purpose: detection and advice for selected mild problems, not triage alone.
- Add six candidate capabilities, data needs, advice boundaries, validation references and priorities.
- Record current NHS sources and executed queries; no detection algorithms or notifications implemented.

## 2026-10-12 — DT and ontology v0.1

- Add multimodal acquisition, quality gate, versioned twin state, assessment and review architecture.
- Add OWL/RDFS vocabulary, SHACL constraints, synthetic data, SPARQL queries and reproducible validation script.
- Pass Turtle parsing, synthetic SHACL conformance, three negative constraints and three competency queries.
- Clinical diagnosis capability is not implemented or validated.

## 2026-10-12 — Portable/home scanner exploration

- Add official product examples, eight follow-up queries, design opportunities and validation criteria.
- Separate professional portability, home photographic monitoring and calibrated 3D self-scanning.

## 2026-10-12 — Sensor landscape and English documentation

- Translate all maintained documents into English while retaining earlier commit history.
- Add 15 sensor categories with condition/purpose mappings, measurement properties and maturity limits.
- Add 27 selected primary, manufacturer and regulatory source records.
- Record 19 executed search queries, source access limitations and discovery exclusions.
- Add proposed ISO 23247 acquisition mappings and ontology observation fields.

## 2026-10-12 — Initial framework

- Create private repository.
- Add five-entity and eight-category OME framework.
- Record dental mapping draft and clinical extension questions.
- Establish progress tracking and ontology planning directory.
