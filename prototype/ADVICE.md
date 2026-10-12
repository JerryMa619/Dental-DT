# Synthetic Advice and Follow-up Demonstration

Date: 2026-10-12. Draft rules, not a clinical decision engine. Run `python -m prototype.advice`; tests: `python -m unittest discover -s tests -v`.

## Scenarios

| Scenario | Expected output |
|---|---|
| Supplied visible-deposit finding | Preventive cleaning information |
| Supplied gingival change and reported bleeding | Cleaning information plus dental review |
| Follow-up without reported bleeding | Report symptom change; no cure claim |
| Rejected acquisition | Repeat scan; no image-dependent care inference |
| Reported breathing/swallowing difficulty, poor scan | Emergency-help action takes priority |
| Reported ulcer lasting 22 days | Dentist/GP review |

All findings and symptoms are synthetic input. No image detector, reconstruction or actual notification is present. This module runs separately from the acquisition prototype: their records are not yet automatically persisted together. Integrating session evidence, snapshots, symptom reports and RDF recommendations is the next engineering step.

## Rule register

| Rule | Type | Basis |
|---|---|---|
| E01 | Emergency symptom routing | NHS toothache emergency guidance; broader conservative routing for demonstration |
| R01 | Reported swelling review | NHS toothache; urgency requires assessment, not classified here |
| R02 | Persistent ulcer review | NHS mouth ulcers: over three weeks |
| R03 | Gum bleeding review | NHS gum disease |
| C01 | Preventive hygiene | NHS gum disease prevention; applied to supplied synthetic findings |
| R04 | Visible gingival change review | Conservative project interpretation; visual change does not diagnose cause |
| Q01/R05/N01 | Rescan/change verification/no supplied finding | Engineering rules, not disease-specific clinical guidelines |

Care is limited to general oral hygiene; no medication, prescription or autonomous treatment. The rules cover only the demonstration fields and are not comprehensive emergency screening. Unknown symptom answers are rejected rather than treated as negative. Trigger labels and priorities require clinical design before real use.

## Ontology extension

[ddt-home-extension.ttl](../ontology/ddt-home-extension.ttl) adds SymptomReport, AdviceProtocol, ReviewCondition, FollowUpRecord and NotificationEvent with relations to core Patient, Assessment and Recommendation. Load it together with the core file. Namespace remains proposed. Extension Turtle parsing passed (38 triples); instance-level SHACL constraints for these new classes are not implemented yet.

## Validation

Seven advice tests plus five acquisition tests passed. Tests check guideline provenance, bleeding review, poor-quality gating, emergency priority, persistent ulcer routing, follow-up identity/no cure claim, and rejection of incomplete symptoms/non-synthetic records. These prove implementation behaviour only, not clinical accuracy.

## Source checks

Read on 2026-10-12:

- https://www.nhs.uk/conditions/gum-disease/
- https://www.nhs.uk/symptoms/toothache/
- https://www.nhs.uk/conditions/mouth-ulcers/

NHS guidance was paraphrased; rule applications and engineering gates are project design. No claim that NHS validates this software.
