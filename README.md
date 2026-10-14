# Dental DT (DDT)

Dental digital twin research based on ISO 23247 architecture mapping and dental ontology.

## Intended use

Home detection and evidence-linked advice for selected mild oral-health problems, with professional review/escalation when needed. See [capability requirements](docs/home-capability-requirements-v0.1.md).

## Interactive demonstration

[Open the English DDT explorer on GitHub Pages](https://jerryma619.github.io/Dental-DT/). Play the scan pipeline to inspect acquisition, quality branches, DTE/UE/CSE exchanges, evidence, longitudinal comparison and advice. The animation is illustrative; all users and observations are synthetic.

## Current stage

A runnable structured simulation connects daily checks, quality-gated snapshots, evidence-linked advice, longitudinal comparison and explicitly supplied feedback. Ontology vocabulary and draft constraints are maintained. Clinical detection, 3D reconstruction and feedback-driven decisions are not implemented.

## Runnable prototype

A synthetic acquisition-to-twin data pipeline is available. See [prototype instructions](prototype/README.md). It does not perform clinical detection.

A separate [synthetic advice and follow-up demonstration](prototype/ADVICE.md) covers supplied mild-problem findings and selected escalation conditions. Its rules are drafts, not clinical validation.

## Synthetic dataset

[Longitudinal dataset](datasets/synthetic/README.md): 30 fictional users, daily JSONL shards and a reproducible generator. Structured simulation only; no image or clinical training claims.

The [daily integration pipeline](prototype/INTEGRATION.md) connects synthetic checks, DT snapshots and evidence-linked recommendations.

[Longitudinal comparison and feedback](prototype/LONGITUDINAL.md) now attaches to each synthetic check-in; it does not infer clinical recovery.

[Interactive explorer source](web/README.md) visualizes the data flow, framework, ontology and [requirement benchmark](evaluation/README.md).

## Documentation

- [Acquisition specification and feasibility plan](docs/acquisition-specification-v0.1.md)
- [DT architecture v0.1](docs/ddt-architecture-v0.1.md)
- [ISO 23247 framework](docs/iso23247-framework.md)
- [Dental sensors and condition mapping](research/dental-sensors-landscape.md)
- [Search log: 12 October 2026](research/search-log-2026-10-12.md)
- [Portable/home scanner feasibility](research/portable-home-scanner-feasibility.md)
- [Progress](PROGRESS.md)
- [Change log](CHANGELOG.md)
- [Ontology plan](ontology/README.md)

## Scope and status

ISO 23247 is a manufacturing framework. Clinical mappings are research proposals, not a conformity claim. The vocabulary and structured simulation are implemented; clinical functionality remains unvalidated. Formal-standard checks, expert review and clinical validation remain pending.

## Working language

English for maintained repository documentation, research records and future code comments. Earlier Git commits retain the original Chinese drafts as history.
