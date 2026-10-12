# Dental DT Framework Explorer

Static English interactive presentation. Select a synthetic patient, replay dates, inspect nine data-flow stages, view five ISO-mapped entities and eight OME categories, explore ontology mappings and inspect the benchmark gap.

Build payload from repository root: `python -m scripts.export_explorer` (RDFLib required; see requirements.txt). Serve web/ with a static web server. Generated data.json is ignored because it is reproducible. Export-check-in downloads one synthetic JSON record. Load-updated-data accepts a local payload produced by the exporter; it does not upload data anywhere.

The hosted page is a static snapshot, not a live GitHub reader. Dataset automation updates GitHub, not this Site deployment. Refresh the hosted page by exporting current data and redeploying, or load an exported data.json locally. No GitHub credential is embedded in the page.

Framework is a project adaptation of ISO 23247, not its original diagram. Ontology visualization shows a selected conceptual relationship view; contextual lines are marked as context rather than claimed OWL properties. Clinical extensions, implementation gaps and synthetic status are explicit.

Verification: JavaScript syntax and payload integrity checked (210 checks, 30 users x 7 days, 44 OWL classes). Browser visual/interaction QA unavailable in this session; no browser test was performed. Benchmark: 11/12 requirements, one visible gap. Clinical validity untested.
