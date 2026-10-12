# Home DDT Capability Requirements v0.1

Date: 2026-10-12. Status: candidate requirements; not implemented clinical functionality.

## Agreed purpose

Provide ordinary users with home oral-health detection and evidence-linked advice for selected mild problems, using scans, reported symptoms and personal history. DDT is not only a triage or image-storage tool. Escalation remains a supporting function for severe, uncertain or persistent problems. Reduced cost/time is a hypothesis to evaluate against missed disease and unnecessary alerts.

Mild symptoms do not establish mild pathology. No symptom does not establish absence of caries. Intended population, exclusions, measurement thresholds and advice protocols require clinical co-design. An adult-first pilot is a proposal, not a user-confirmed restriction.

## Candidate capability matrix

| ID | Problem | Detection target | Required inputs | Permitted advice concept | Boundary / escalation | Validation reference | Priority |
|---|---|---|---|---|---|---|---|
| H01 | Plaque/cleaning deficits | Localize suspected visible deposits and monitor cleaning change | Standardized RGB; surface/site mapping; optional validated fluorescence or disclosed-plaque protocol | Site-specific brushing/interdental-cleaning guidance and progress feedback | RGB alone may miss plaque or confuse stains/food; no guarantee all plaque removed; no home scraping instruction | Clinician plaque scoring and appropriate disclosure/reference protocol; per-site sensitivity/specificity and segmentation agreement | Core candidate |
| H02 | Gingival irritation/inflammation signs | Localize redness/swelling and compare appearance | Colour-controlled RGB; symptom reports including bleeding/duration; history | Oral hygiene guidance plus dental-review recommendation where indicated | Do not classify periodontitis or call bleeding gums safe for home-only management; NHS advises dental review for bleeding/painful/swollen gums | Dentist examination and periodontal chart including probing/BOP; separate appearance detection from clinical diagnosis | Core candidate |
| H03 | Tooth wear/visible defects | Measure surface/shape change above repeatability error | Calibrated 3D, longitudinal registration, RGB, symptom/diet history | Preventive habits and monitoring; professional review for new/progressive changes | Geometry cannot identify cause or diagnose bruxism; fractures, pain and uncertain changes need review | Professional scan/reference measurement; trueness, precision and minimum detectable change | Core candidate |
| H04 | Suspected caries/demineralization | Detect candidate optical lesions and visible cavities | RGB plus validated NIR/fluorescence if included; site mapping; symptoms/history | Preventive oral-care advice alongside dental assessment | Cannot determine lesion activity/depth from colour alone; do not claim a cavity can be repaired by self-care or that absent symptoms exclude decay | Clinician caries examination with indicated imaging; sensitivity/specificity stratified by site, lesion and restoration | Next-stage candidate |
| H05 | Short-lived visible mucosal lesion | Record lesion location, size trend and duration | RGB, accessible soft-tissue coverage, onset and symptom questionnaire | Low-risk comfort/irritant-avoidance information from reviewed guidance | No visual-only diagnosis or exclusion of cancer; ulcer over 3 weeks requires dentist/GP review; worsening/atypical lesions need assessment | Clinician diagnosis and follow-up; persistence-alert performance | Optional later module |
| H06 | Mild sensitivity complaint | Record trigger/duration and associate with site | Questionnaire plus relevant scans; past treatment/history | General preventive information; targeted dental evaluation | Symptoms are not sensed by optical scanner; cannot distinguish sensitivity, caries, cracks or pulpitis from scans alone; pain triggers review | Dentist differential assessment with relevant tests | Questionnaire support; not scanner diagnosis |

Priorities are design proposals. Source guidance supports advice boundaries, not the diagnostic accuracy of the proposed hardware or algorithms.

## Minimum recommendation contract

Each recommendation records target site/problem, observation evidence, data-quality scope, uncertainty, model/protocol version, rationale, proposed action, review condition and escalation triggers. Do not invent numeric clinical thresholds or assign uncalibrated confidence percentages. Personalized treatment/prescribing is not implemented.

## Symptom and quality gate

Check symptoms before interpreting a scan; significant swelling, systemic illness or severe pain may require care even if images look normal. Insufficient visibility requires rescan or review, not a negative disease result. Relevant breathing/swallowing difficulties prompt emergency instructions according to location, without waiting for a clinician-message acknowledgement.

## Clinician notification design

The user wants warnings and dentist notification for serious findings. Future workflow requires an identified dentist, explicit consent and verified destination; record delivery/reply state. No notifications are sent or configured by this requirements document.

## Acceptance plan

- Acquisition: novice completion, surface coverage, calibrated colour/geometry, false quality acceptance and repeatability.
- Detection: patient-level held-out evaluation; per-site sensitivity/specificity, false-negative/positive rates, restoration and lighting subgroups. Thresholds pending clinical use-case design.
- Advice: clinician-reviewed correctness, supported scope, inappropriate reassurance and escalation accuracy.
- Longitudinal: reference-confirmed changes versus acquisition drift.
- Impact: user time/cost, unnecessary consultations and delayed necessary care; routine dental check-ups are not removed by a negative scan.

## Framework and ontology implications

Keep the existing Observation -> Finding -> ClinicalAssessment -> Recommendation chain. Add symptom reports, advice protocols, review conditions and notification events in a later ontology revision; those classes are not yet implemented in v0.1. Existing v0.1 is a structural scaffold, not a diagnostic engine.

## Sources consulted

- https://www.nhs.uk/conditions/gum-disease/ — symptoms, dental review and hygiene guidance.
- https://www.nhs.uk/conditions/tooth-decay/ — possible absence of early symptoms, dental assessment and treatment distinction.
- https://www.nhs.uk/live-well/healthy-teeth-and-gums/how-to-keep-your-teeth-clean/ — brushing guidance.
- https://www.nhs.uk/live-well/healthy-teeth-and-gums/take-care-of-your-teeth-and-gums/ — interdental hygiene and sugar-related prevention.
- https://www.nhs.uk/conditions/mouth-ulcers/ — duration and review boundary.
- https://www.nhs.uk/symptoms/toothache/ — emergency warning symptoms.
- https://www.england.nhs.uk/long-read/clinical-guidance-unscheduled-urgent-and-non-urgent-dental-care/ — urgent-care context.

Retrieved 2026-10-12. Gum-disease and tooth-decay pages opened directly; other records assessed through indexed excerpts. No full clinical protocol or device validation was performed.

## Executed queries

1. site.nhs.uk gum disease symptoms treatment bleeding gums
2. site.nhs.uk tooth decay symptoms treatment
3. site.nhs.uk mouth ulcers 3 weeks
4. site.nhs.uk dental abscess emergency swelling difficulty breathing
5. site.nhs.uk conditions gum-disease dentist bleeding gums
6. site.nhs.uk live-well healthy-teeth-and-gums how-to-keep-your-teeth-clean

Queries 1–4 used System 2; 5–6 used System 1. Only authoritative NHS/government records were retained; unrelated commercial results were excluded.
