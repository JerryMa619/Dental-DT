# Daily Synthetic Dataset Update

Created: 2026-10-12. A ChatGPT scheduled automation is enabled from 2026-10-13, recurring daily around 08:00 Europe/London (flexible schedule, execution may be within an hour of this time). This is not a GitHub Actions workflow.

Each run reads the current generator and manifest, adds 30 deterministic fictional-user records for each missing local date, validates counts/IDs and tests, then commits new shards and manifest/change-log updates to main. Historical shards remain unchanged. Failed access/tests/conflicts must be reported; successful scheduling is not a guarantee that every future run will succeed.

The simulated capture timestamp is 08:00 even if task execution is later. Data remain explicitly synthetic, with no image/geometry files or clinical ground truth. No dentist notifications are sent.
