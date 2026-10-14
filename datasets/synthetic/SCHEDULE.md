# Daily Synthetic Dataset and Display Update

The existing ChatGPT automation runs each morning around 08:00 Europe/London (flexible scheduling). It is the sole daily raw-data writer; the GitHub Actions workflow publishes the website after commits rather than independently generating duplicate data.

Each run reads current main and executes `python -m scripts.update_daily`. This verifies existing deterministic shards, preserves supplied feedback, appends 30 fictional checks for every missing local date, rebuilds integration and `web/data.json`, and updates the English change log. Historical raw bytes are preserved. Repeated execution for the same date adds no records.

Run the Python and all JavaScript checks before committing. Commit with an expected-head lease and include the display export with the raw/manifest/integrated changes. Never overwrite a concurrent update. Inspect the Pages workflow result and report deployment failures.

The English Pages site and Sites mirror request the tracked public GitHub export on load, focus and every five minutes when visible. They display data version/date and sync errors. Public repository access is required. The bundled fallback is dated and does not claim a successful sync.

The simulated capture time remains 08:00 even if execution is later. Missing adherence stays not-reported. All data are synthetic with no image/geometry files or clinician labels. No dentist messages are sent. Scheduling does not guarantee future execution or deployment success.
