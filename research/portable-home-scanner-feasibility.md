# Portable and Home Dental Scanner Feasibility

Date: 2026-10-12. Preliminary product landscape and design judgement; not a patent novelty opinion or exhaustive prior-art search.

## Existing examples

| Category | Example | Verified scope | Source |
|---|---|---|---|
| Professional wireless 3D intraoral scanner | 3Shape TRIOS 5 Wireless | Professional scanner, computer-based workflow | https://www.3shape.com/en-gb/scanners/trios-5 |
| Professional mobile 3D intraoral scanner | Medit i900 Mobility | Wireless connection to iPad or laptop; Medit Link Express on iPad | https://www.medit.com/medit-i900-mobility/ |
| Patient home imaging/remote monitoring | DentalMonitoring ScanBox pro and app | Smartphone tooth photographs sent to the practice from home | https://dentalmonitoring.com/en-gb/for-patients/ |
| Combined professional imaging | iTero Element 5D | 3D, colour and near-infrared imaging | https://itero.com/en-gb/our-solutions/itero-element-5d |

Sources were retrieved as official manufacturer search excerpts. Professional portability does not establish untrained patient self-use. Smartphone photographic monitoring does not establish independent acquisition of a calibrated full-arch 3D mesh. AI-generated geometry must be separated from measured geometry.

## Innovation assessment (project inference)

Portability, wireless connectivity, smartphone connection and generic home monitoring already exist. They are weak novelty claims in isolation. A stronger research direction is repeatable, patient-operated 3D acquisition with explicit quality/coverage checking and longitudinal dental-twin updates.

Candidate technical contributions:

- Guided acquisition that detects missing surfaces and requests targeted rescans.
- Geometry/control aids to make self-scanning repeatable without obscuring the surfaces being measured.
- Calibration and uncertainty estimation that prevent registration error from being mistaken for tissue change.
- Baseline professional scan plus home observation updates, with provenance and separation of measured/predicted geometry.
- Demonstrated usability and scan performance in novice operators compared with a professional reference.

These are opportunities, not claims of world-first technology. A dedicated literature and patent search is required before a novelty claim.

## Design challenges

Posterior/lingual access, saliva and fogging, reflective/translucent enamel, tongue and cheek movement, illumination, scan stitching drift, scale calibration and cross-session registration. Mouthpiece geometry can stabilize acquisition but may obscure surfaces and cannot guarantee full coverage.

## Proposed first prototype

Start with one explicit monitoring use case, such as orthodontic position/aligner follow-up. Use guided RGB acquisition and a professional baseline if available. Treat this as imaging monitoring until independent 3D accuracy is demonstrated. Add calibrated depth/structured-light optics only with a defined target metric and reference method.

Validation: completion rate; scan duration; novice-versus-expert acquisition; tooth/surface coverage; geometric trueness and precision; repeated-scan change detection; failure detection; comparison with phone-photo-only and professional-scanner baselines. Set thresholds from intended clinical purpose, not arbitrary universal micrometre targets.

Optical surface scans do not directly measure periodontal pockets, pulp blood supply or bone; additional modalities remain necessary for those questions.

## DDT integration

Scanner/appliance: Equipment OME (and Product where manufactured appliance tracking is relevant). Self-scan procedure: Process OME. Acquisition/quality interfaces: DCDCE. Registration and longitudinal state management: CE. Patient/clinician interaction: UE. Provenance/units/secure exchange: CSE. Patient anatomy is the clinical extension.

## Follow-up search log

| Engine | Exact query |
|---|---|
| System 2 | site.3shape.com TRIOS wireless MOVE portable intraoral scanner |
| System 2 | site.meditscanner.com i900 mobility wireless intraoral scanner |
| System 2 | site.dental-monitoring.com ScanBox pro smartphone home scan |
| System 2 | at home patient self intraoral 3D scanner dental consumer |
| System 1 | patient self scanning intraoral scanner home 3D dental |
| System 1 | home dental 3D scanner patent self scanning mouthpiece |
| System 1 | site.medit.com i900 mobility iPad |
| System 1 | site.dentalmonitoring.com 3D model scan smartphone baseline |

The domain spellings in search queries are retained exactly as executed. Broad System 1 self-scanning/patent queries mostly returned unrelated results; no patent novelty conclusion can be drawn. Relevant Medit official results corroborated iPad connectivity. Research preprints on image-based reconstruction/robot scanning were discovery leads only and not treated as commercial home devices.
