# ISO 23247 DT Framework and Dental Mapping

Status: preliminary research draft. Updated: 2026-10-12.

## 1. Standard reference and boundaries

ISO 23247 addresses manufacturing. DDT adapts its architecture to dentistry. Keep original standard concepts, project mappings and proposed extensions distinct. Names below were checked against public ISO pages and NIST explanations. The 2021 NIST report describes ISO/DIS; final terminology and requirements still need verification against the published standard.

The observable manufacturing domain is outside the DT framework boundary and supplies its physical context. Five major entities are not five domains.

## 2. Five major entities

| Abbreviation | Name | Responsibility |
|---|---|---|
| OME | Observable Manufacturing Element | Observable real-world object |
| DCDCE | Data Collection and Device Control Entity | Data collection and device control |
| CE | Core Entity | Digital representation, operations, management, applications and services |
| UE | User Entity | Interaction by people or external systems |
| CSE | Cross-System Entity | Data translation, data assurance and security across domains |

## 3. Eight OME categories, not eight fixed instances

| Category | Proposed dental examples |
|---|---|
| Personnel | Dentists, dental technicians, nursing staff |
| Equipment | Intraoral scanners, imaging equipment, milling machines, 3D printers |
| Material | Zirconia, resin, titanium, impression materials |
| Process | Examination, scanning, treatment, design, manufacturing, follow-up |
| Facility | Dental surgery, laboratory, sterilization facilities |
| Environment | Temperature and humidity in clinical/manufacturing settings |
| Product | Crowns, bridges, dentures, aligners, implant-supported restorations |
| Supporting document | Procedures, material instructions, design requirements, quality records |

Each category can contain multiple instances. Dental examples are proposals, not dental definitions supplied by ISO. Inclusion depends on the use case.

## 4. Clinical extension: pending

Patients, natural teeth and oral tissues are not automatically manufacturing products. Consider Patient and Anatomical structure concepts with explicit mapping/extension relationships. Ontology inheritance is undecided; this proposal is not a standard requirement.

## 5. Ontology role

Define classes, properties, relations and constraints; the knowledge graph holds instances. Separate measured facts, clinical judgements and model predictions. Capture identity, time, provenance, units, versions and evidence.

Ontology does not replace geometry, behaviour models or synchronization. Integration details follow entity responsibility design.

## 6. Next steps

1. Confirm objects, boundaries and observable properties for each OME category.
2. Resolve patient/anatomical modelling.
3. Expand DCDCE, CE, UE and CSE sub-entities/functions.
4. Select a minimum validation use case and ontology competency questions.
5. Use the [sensor inventory](../research/dental-sensors-landscape.md) to define observations and acquisition needs.

## References

- [ISO 23247-1:2021](https://www.iso.org/standard/75066.html)
- [ISO 23247-2:2021](https://committee.iso.org/standard/78743.html)
- [NIST AMS 400-2](https://doi.org/10.6028/NIST.AMS.400-2)
