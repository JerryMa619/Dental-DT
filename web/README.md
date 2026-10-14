# English DDT Framework Explorer

Open the [GitHub Pages explorer](https://jerryma619.github.io/Dental-DT/) or the existing [private Sites mirror](https://dental-dt-framework.indigobud6.chatgpt.site).

The illustrative scan animation covers the recorded target tooth (46, buccal surface). Pipeline playback expands DCDCE acquisition, DTE/CE state and assessment, UE advice and feedback, and CSE exchange checks. No real scan, reconstructed mesh, production authentication or notification is performed.

## Data synchronization

The page first reads the public repository's `main/web/data.json`. It retries on focus and every five minutes while visible, and offers **Refresh data**. New data do not interrupt active replay. A failed initial request uses a labelled, dated bundled snapshot; later failures retain the loaded data and display an error. Imported local JSON is labelled separately.

The existing London-morning automation runs `python -m scripts.update_daily`, verifies tests, and commits the raw shards, manifest, integrated outputs and tracked display export together. No future success is guaranteed; conflicts and failures must be reported. A push to main runs `.github/workflows/pages.yml`, which rebuilds and validates the data, then deploys `web/` through GitHub Pages. GitHub Pages must use **GitHub Actions** as its source.

The Sites mirror uses the same public data endpoint, so daily data updates require no daily Sites redeployment. Changes to UI source still require a Sites publication.

## Local use

Run `python -m scripts.export_explorer`, then serve `web/` with a static HTTP server. No external Python package is needed for the export. Named OWL class declarations are inventoried from the maintained Turtle files; this is explicitly not RDF validation, inference or SHACL checking. Use `scripts/validate_ontology.py` and the pinned requirements for formal ontology checks.

## Checks

```sh
python -m unittest discover -s tests -p 'test_*.py'
node tests/test_flow_replay.cjs
node tests/test_flow_ui_contract.cjs
node tests/test_entity_chain.cjs
node tests/test_data_sync.cjs
```

The requirement benchmark is visible and retains its known persistent-toothache failure. Script/DOM-contract checks do not establish browser visual quality or clinical capability.
