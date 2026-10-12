# Longitudinal Synthetic DDT Dataset v0.1

Created 2026-10-12. Initial bootstrap: 30 fictional users x 7 backfilled simulation days (2026-10-06 through 2026-10-12) = 210 records. These historical dates are simulated, not actual past scans.

## Purpose

Structured-data pipeline development, temporal feature experiments and rule-output imitation. Not a dental-image dataset, clinical ground truth or validated disease-training resource. No images, meshes, real patients or clinician annotations are included. Scores are arbitrary unitless simulated signals, not device measurements or probabilities. Any model trained on these targets learns generator/rule behaviour, not clinical diagnosis.

## Generation

`python -m prototype.generate_dataset --date YYYY-MM-DD`

30 records per shard. Seed determined by generator version, date and user. Four toy trajectories: stable, improving, worsening and fluctuating. Latent burden trends and observation noise are illustrative, not biological models. Simulated check-in time is 08:00 Europe/London; actual scheduled execution may occur later. Quality failures deliberately mask observation values; symptom reports can still trigger review.

Train users SYN-000..020 (21); validation SYN-021..024 (4); test SYN-025..029 (5). Patient assignments remain stable across dates. Keep simulation_targets and rule_outputs outside predictors. Rule-output training risks circularity; image absence means no vision training. Freeze evaluation cohorts/date ranges for experiments rather than treating daily growth as independent evidence.

Fields: stable example/patient IDs, local capture time with offset, previous-day ID, symptoms, region and quality, simulated numeric observations, separate simulation targets, guideline-linked draft rule outputs and synthetic provenance. A first-day previous ID may point before the available bootstrap period; it is a logical link, not proof a record exists.

## Updates and integrity

Append one date-named file per day; do not change old shards. If execution dates were missed, generate missing shards sequentially and mark backfill in manifest. Generator refuses conflicting existing local content. Repository updater must likewise verify any existing shard before skipping or modifying. A changed generator requires a new version/data series.

Manifest contains available dates, cohort size, counts and scheduled-task metadata when established. Dataset size is a prototype default, not a statistically adequate training sample.

## Validation

16 tests passed on 2026-10-12, including four dataset tests for deterministic regeneration, unique IDs, patient-split/temporal continuity, quality masking and a toy improving trajectory. Clinical validity and distribution realism are untested.
