# Requirement Benchmark v0.1

Run `python -m evaluation.run_benchmark`. Twelve manually authored cases are maintained independently from the procedural daily-data generator. Expected actions/priorities are written before executing the rules. This is a software-requirement benchmark, not independent clinician annotation, statistical clinical validation or a diagnostic accuracy test.

Result 2026-10-12: 11 scenarios meet requirements; 1 known failure (persistent toothache of three days is not consumed by the current rule module). NHS reference: https://www.nhs.uk/symptoms/toothache/ . The failure remains visible; no claim all requirements are met. The regular unit suite still passes its narrower implementation tests.

Scenario coverage: cleaning, bleeding, poor quality, emergency override, persistent ulcer, no finding, surface change, combined symptom/quality cases and persistent pain. Future clinician-authored/adjudicated scenarios and broader populations are required.
