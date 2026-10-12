# Longitudinal Comparison and Advice Feedback v0.1

Implemented in longitudinal.py and integrated into integrate_daily.py. Run `python -m prototype.integrate_daily` and `python -m unittest discover -s tests -v`.

## Comparison

Compare the same patient's same-site current check-in with the previous check-in. Require increasing timestamps and both observations available. Otherwise return no-baseline, insufficient-data or site-mismatch. Never interpret missing observations as improvement or silently use older data as current.

Compare deposit_score/redness_score separately. Directions: increased, decreased, within-demo-tolerance. Combined state preserves mixed directions. The default tolerance 0.1 is arbitrary for unitless synthetic scores, not a device-error estimate or clinical threshold. No disease improvement, worsening or cure is inferred; no causal effect of advice is inferred.

## Feedback contract

Optional daily-row field:

```json
{"adherence_feedback":[{"recommendation_id":"2026-10-12:SYN-000:recommendation:0","status":"reported-completed","reported_at":"2026-10-13T08:00:00+01:00"}]}
```

Use an ID that actually exists in that user's preceding check-in. Status can be reported-completed, reported-partial, reported-not-completed or unknown. reported_at must match the current check-in capture time and include timezone. Unknown/duplicate recommendation IDs are rejected. Missing feedback means not-reported, never non-adherence. Reports are synthetic and not verified execution.

The current seven-day dataset contains no feedback field. Thus its derived histories show not-reported. Completion/partial feedback functionality is demonstrated in tests; no adherence records were invented or inserted into historical raw shards. A richer feedback generator is a separate future data-series design.

## Results

2026-10-12: 24 tests pass. Four new checks cover decreased indicators with reported completion, missing-data non-improvement, absence/invalid-reference feedback and mixed/stable directions. Derived summary/example refreshed, integration version 0.2.0.

The daily updater reads current integration dependencies and regenerates these derived comparisons. RDF representation/constraints for feedback remain pending.
