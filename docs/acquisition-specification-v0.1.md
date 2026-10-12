# Acquisition Specification and Feasibility Plan v0.1

Date: 2026-10-12. Status: proposed engineering requirements, not demonstrated performance. Scope: H01 visible deposits/cleaning deficits, H02 visible gingival changes, H03 tooth wear/defect changes. Priorities approved for exploration; numerical acceptance thresholds and hardware are undecided.

## 1. Target user and intended function

Ordinary users perform repeat home acquisition. DDT detects selected observable abnormalities and offers evidence-linked preventive/care advice, with review/escalation when needed. Symptoms and history complement scans. No healthy-mouth guarantee or home-only treatment promise.

## 2. Requirements traceability

| ID | Capability | Required acquisition | Ground truth | Key failure |
|---|---|---|---|---|
| A01 | H01 visible suspected deposits | Site-linked RGB with controlled illumination; record cleaning timing | Clinician plaque scoring and validated reference/disclosure protocol | Plaque mistaken for stain/food; invisible plaque missed |
| A02 | H02 visible gingival changes | Gingival-margin RGB with colour calibration and comparable view; user-reported bleeding/symptoms | Clinical examination and periodontal chart | Lighting-induced redness changes; deeper disease missed |
| A03 | H03 wear/defect change | Calibrated 3D plus RGB, same-site registration, coverage and uncertainty | Independent reference geometry and clinical assessment | Stitching/registration drift mistaken for tissue loss |
| A04 | All | Tooth/surface identity, timestamps, device/calibration and raw frames | Annotation audit and synchronization checks | Wrong tooth or cross-session misassociation |
| A05 | All | Capture-quality feedback including missing regions | Expert usability/quality judgement and reference coverage | Incomplete scan accepted as negative result |

RGB alone is not assumed to detect all plaque. Optical mechanism for 3D is undecided; monocular predicted geometry is not measured depth. Ordinary phone footage can test acquisition guidance, but cannot establish H03 metrological capability.

## 3. Device concept

Proposed first form: phone-connected handheld intraoral head with controlled light, RGB and calibrated geometry sensing. NIR is optional after the core acquisition feasibility test. Wireless is optional; a cable is acceptable for a prototype. Phone app guides region capture and shows quality status.

Do not select sensor parts, optical architecture, resolution or cost before working distance, field of view, target region and required minimum detectable change are derived. Optical, thermal, electrical, contact-material and cleaning requirements must be addressed before participant use.

## 4. Coverage map

Proposed target regions: upper/lower arches; buccal/labial and lingual/palatal surfaces; occlusal/incisal surfaces as applicable; visible gingival margins. Include posterior regions as an explicit challenge rather than claiming whole-mouth success. Invisible interproximal/subgingival anatomy is recorded as unobserved.

Per-region status: captured, quality-rejected, missing or outside scope. Whole-mouth status is derived from these records. User interface must distinguish current measured regions from baseline-only or predicted regions.

## 5. Home acquisition sequence

1. Collect symptoms, recent procedures and relevant history; route concerning symptoms before a normal scan result.
2. Check device connection, cleanliness protocol and calibration validity.
3. Capture predefined regions with live prompts; allow pause and targeted rescan.
4. Evaluate blur, exposure, glare, occlusion, fogging, coverage and tracking.
5. Associate accepted observations with patient/tooth/site and retain failed-region metadata.
6. Register current geometry against a justified baseline and quantify uncertainty.
7. Produce a partial/full scoped update and appropriate detection/advice output.

The order within arch capture is an initial user-flow hypothesis to be tested; no fixed clinical scan path is prescribed yet.

## 6. Data contract

| Record | Minimum fields |
|---|---|
| Session | session_id, pseudonymous_patient_id, operator_role, start/end time, symptom_record_id, device_id, calibration_id |
| Frame/artifact | artifact_id, session_id, modality, capture_time, media_type, location, checksum, region annotation |
| Geometry | mesh/point-cloud URI, length unit, coordinate frame, reconstruction version, measured/predicted status |
| Quality | evaluated_region, status, failure reason, coverage definition, quality-method version |
| Registration | source/target snapshot, transform, method version, reference region, registration error/uncertainty |
| Finding | site, evidence IDs, method/version, interpretation, uncertainty and review status |
| Advice | finding/assessment IDs, protocol/version, action, rationale, review/escalation conditions |

Calibration is a session-bound immutable record, not only a mutable device field. Existing ontology v0.1 does not yet implement all contract fields; this specification guides v0.2.

## 7. Staged feasibility experiments

| Gate | Setup | Test | Output |
|---|---|---|---|
| G1 bench acquisition | Dental models, reference colours/geometry, simulated wetness and occlusion | Coverage, glare, tracking and repeated geometry | Evidence for sensor/optics choice |
| G2 reference repeatability | Stable object, repeated acquisition and registration | Apparent change when no true change exists | Noise floor/minimum detectable change |
| G3 known changes | Reference models with independently measured changes | Detection above noise and localization | Change-detection operating curve |
| G4 novice usability | Initially simulator/model tasks; human studies only after appropriate preparation | Completion, duration, posterior access, rescan comprehension | User-flow improvements |
| G5 clinical validation | Defined population, independent dental references, patient-held-out evaluation | H01/H02/H03 sensitivity, errors and advice appropriateness | Supported claims and limitations |

No scans or participant studies have been performed. G1-G3 are the next practical experiments. A clinical partner, suitable study design and relevant review are needed before G5.

## 8. Metric definitions

- Region coverage: accepted observed reference surface area / target reference surface area, using predefined region masks; mesh completeness without ground truth is only a proxy.
- Precision: agreement across repeat scans of a stable reference.
- Trueness: deviation from an independent higher-quality reference with declared registration method.
- False change: detected differences on an unchanged target.
- Minimum detectable change: empirically established against uncertainty and clinically meaningful use-case changes; no universal micrometre claim.
- Detection accuracy: sensitivity/specificity, per-site and per-patient, with confidence intervals and patient-level dataset separation.
- Quality failure: false acceptance of unusable data and false rejection of usable data.
- Usability: task completion, acquisition duration, repeat attempts and user comprehension.
- Advice quality: clinician-assessed appropriateness, unsupported reassurance and correct escalation.

Acceptance thresholds remain TBD. Set them with clinical use-case requirements before validation, not retrospectively to match achieved performance.

## 9. Implementation order

First build a session/region-quality data model and synthetic end-to-end pipeline. Then use existing/reference scans to develop identity, storage and change visualization while bench hardware work proceeds. Add H01/H02/H03 inference only with suitable labelled data and validation. Do not block ontology/data-system development on a custom scanner.

## 10. Open design decisions

Initial population; first clinically measurable change; acceptable geometry error; self-scan head dimensions; geometry optics; cleaning/contact approach; reference-data access; prototype budget; compute/export requirements. Defaults remain proposals until confirmed.

This document is an engineering elaboration of [home capability requirements](home-capability-requirements-v0.1.md), with clinical-source context preserved there and in the sensor research. No new literature search or performance claim was added in this step.
