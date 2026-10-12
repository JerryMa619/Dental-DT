# Dental Sensors and Condition Mapping

Search date: 2026-10-12 (Europe/London). Status: preliminary landscape scan, not a systematic review, procurement specification or validated clinical decision system.

## Main finding

Existing dental sensing spans optical imaging, mechanical/electrical measurements and biochemical assays. Several commercial systems provide episodic clinical measurements; continuous intraoral biomarker platforms remain mainly research-stage. A device measures an observable property: disease assessment generally requires interpretation and complementary evidence.

## Scope and evidence labels

Includes physical sensors, sensing instruments and imaging detectors; a scanner or test system is not necessarily a standalone sensor component. Commercial means a named device is documented by its manufacturer or regulator, not that UK availability, authorization, API access or accuracy has been independently verified. Research includes laboratory, model, clinical-sample and human feasibility work; these are not interchangeable. No numeric diagnostic performance or universal thresholds are asserted.

## Sensor inventory

| ID | Sensor or system | Measured property | Condition or clinical purpose | Example and maturity | Update pattern | Interpretation limit | Sources |
|---|---|---|---|---|---|---|---|
| D01 | Laser fluorescence | Fluorescence score at a tooth site | Caries detection adjunct | DIAGNOdent pen; commercial | Site/visit | Plaque, stains and conditions affect readings; not lesion depth or a standalone diagnosis | S01 |
| D02 | Near-infrared transillumination | Light transmission image | Proximal/other caries and crack assessment adjunct | CariVu; commercial device documented | Site/visit | Images require interpretation; performance varies with site and restoration | S02 |
| D03 | Digital intraoral X-ray detector | Radiographic image | Caries; periapical/restorative assessment | Schick; clinical imaging | Visit/image | Ionizing imaging, not continuous monitoring; interpretation and clinical indication required | S24,S25,S26 |
| D04 | Electronic constant-force periodontal probe | Pocket depth in mm; attachment level with reference measurements | Periodontal assessment and follow-up | Florida Probe; commercial | Tooth/site/visit | Bleeding is an observed charted sign, not necessarily automatically sensed; recession needed for attachment calculation | S03,S04 |
| D05 | Photoacoustic/ultrasound transducer | Pocket depth and tissue geometry | Periodontal assessment research | Human feasibility prototypes | Site/scan | Early evidence; access, contrast and acquisition issues; not a routine probe replacement | S20,S21 |
| D06 | Electrochemical or surface-acoustic-wave immunosensor | Salivary MMP-8 concentration or assay response | Periodontal inflammation biomarker adjunct | Disposable/SAW/MIP research platforms | Sample/assay; wearable concept | Total and active MMP-8 assays differ; salivary signal is not inherently tooth-localized or sufficient for staging | S13,S14,S15 |
| D07 | Potentiometric/ISFET or optical pH sensor | pH and acid-exposure time course | Caries risk/activity research; acid-exposure context | Micro-pH and O-pH; wearable pilot | Spot or time series | Plaque/lesion/saliva pH are different; low pH alone does not prove caries or erosion | S16,S17,S18 |
| D08 | Thin-film occlusal force sensor | Relative contact force, location and timing | Occlusal assessment; restorative load distribution | T-Scan; commercial | Bite/time series | Relative percentages are not calibrated absolute force; cannot independently diagnose TMD or bruxism | S05,S06 |
| D09 | Surface EMG with optional ECG | Masseter activity, episode features and heart rate | Sleep bruxism assessment | Bruxoff and related portable systems; validation studies | Overnight time series | Chewing/swallowing and other activity can confound; not direct tooth force or a TMD diagnosis | S07,S08 |
| D10 | Resonance-frequency sensor | Implant stability quotient (ISQ) | Implant stability/healing monitoring | Osstell/Penguin; commercial | Implant/visit | Mechanical surrogate; not direct osseointegration measurement and not peri-implantitis diagnosis | S09,S10 |
| D11 | Electric pulp testing electrode/system | Stimulus level and patient response | Pulp sensibility assessment supporting endodontic diagnosis | Clinical test system | Tooth/visit | Stimulates nerves rather than directly sensing blood supply; no response alone does not prove necrosis | S11,S12 |
| D12 | Laser Doppler/optical pulse-oximetry dental probe | Perfusion signal or optical oxygenation estimate | Pulp vitality and post-trauma assessment | Specialist/research dental probes | Tooth/visit | Geometry and surrounding tissues affect readings; not standalone pulpitis classification | S11,S12 |
| D13 | Flexible LC or iontronic orthodontic force sensor | Force components, pressure or resonant response | Malocclusion treatment monitoring | Model-tested LC and experimental aligner systems | Appliance/time series | Treatment-load monitoring rather than disease diagnosis; population and calibration need checking | S22,S23 |
| D14 | Electrochemical salivary multiplex biosensor | IL-8 protein and mRNA assay signals | Oral squamous-cell carcinoma biomarker research | Clinical-sample research prototype | Sample/assay | Biomarkers are not cancer-specific; not a biopsy replacement | S19 |
| D15 | Graphene/peptide bacterial sensor | Target bacterial binding response | Oral pathogen sensing research | Tooth-mounted proof of concept | Binding event | Bacterial detection is not proof of caries/periodontitis; bovine demonstration does not establish human wearable readiness | S27 |

## Condition-centred view

| Condition/purpose | Relevant sensor IDs | What remains outside sensor measurement |
|---|---|---|
| Dental caries | D01,D02,D03; D07 as risk/activity research | Clinical confirmation, lesion extent/activity and treatment decision |
| Gingivitis/periodontitis | D04,D05,D06; D03 for relevant imaging | Clinical diagnosis/staging; biomarker positivity is not staging |
| Pulp vitality, trauma and endodontic assessment | D11,D12; D03 for complementary imaging | Full symptom/examination interpretation and inflammation classification |
| Sleep bruxism | D09; D08 only for complementary occlusal assessment | Distinguishing other muscle activities and comprehensive assessment |
| Implant stability | D10; D08 for occlusal load context | Peri-implantitis requires separate tissue/inflammation/bone assessment |
| Malocclusion treatment | D13 | Tooth displacement needs geometry/registration; force is not displacement |
| Oral cancer biomarker research | D14 | Clinical assessment and histopathological confirmation |
| Acid exposure/possible erosive risk | D07 | Erosive tissue loss is not established by pH alone |

## Proposed ISO 23247 mapping (project interpretation)

- Equipment OME: scanner, probe, detector, assay reader and their calibration state.
- Product OME: fabricated sensing aligner or mouthguard where applicable; it can also be an acquisition platform.
- Process OME: examination, scanning, specimen collection and measurement procedures.
- Supporting document OME: instructions, calibration records, protocols and reports.
- DCDCE: acquisition, device interfaces, timestamps and transport of observations.
- CE: patient/tooth state updates, longitudinal integration and validated inference.
- CSE: identifiers, units, provenance, quality and secure exchange.
- Patient/anatomical features remain an explicit clinical extension, not automatically manufacturing products.

A physical device can have several roles. Its equipment representation and its data-acquisition functions should not be conflated.

## Proposed ontology observation fields

Observation ID; sensor/device ID and type; patient and anatomical site where known; observed property; value and unit; phenomenon time and result time; sampling matrix (saliva/plaque/tissue); method; calibration version; quality/uncertainty; source; raw artifact; derived-versus-measured status; clinical interpretation with evidence and author.

Use separate relations such as measuresProperty, observesFeature and supportsAssessmentOf. Do not encode a generic sensor-to-disease relationship as an automatic diagnoses relation. Saliva assays should not be assigned to a particular tooth without evidence.

## Candidate starting points (design judgement)

1. Periodontal twin: electronic probing plus imaging and visit history; add biomarkers as a research extension.
2. Bruxism/occlusal twin: EMG time series plus occlusal observations; validate event recognition and synchronization.
3. Caries twin: site-linked fluorescence/NIR/imaging; pH adds risk context and requires calibration.

Select based on the data and clinical partners actually available. Device export/API support, costs, calibration, safety and UK regulatory status have not been assessed.

## Source register

### S01 — KaVo DIAGNOdent pen

- URL: https://www.kavo.com/en-uk/products/instruments/diagnostics/diagnodent-pen
- Evidence/access: Manufacturer; search excerpt.
- Supports: Laser fluorescence commercial example; not independent accuracy evidence.

### S02 — DEXIS CariVu 3-in-1 FDA submission

- URL: https://www.accessdata.fda.gov/cdrh_docs/pdf18/K182712.pdf
- Evidence/access: Regulatory submission; search excerpt.
- Supports: Imaging aid for caries and cracks; not a universal diagnostic guarantee.

### S03 — Florida Probe

- URL: https://www.floridaprobe.com/
- Evidence/access: Manufacturer; search excerpt.
- Supports: Computerized periodontal probing and charting.

### S04 — Description and clinical evaluation of a new computerized periodontal probe

- URL: https://pubmed.ncbi.nlm.nih.gov/3162246/
- Evidence/access: Original study; indexed abstract.
- Supports: Constant-force electronic depth measurements.

### S05 — T-Scan digital occlusal analysis

- URL: https://www.tekscan.com/index.php/products-solutions/digital-occlusal-analysis
- Evidence/access: Manufacturer; search excerpt.
- Supports: Dynamic contact force and timing; relative force, not automatically Newtons.

### S06 — Tekscan product overview

- URL: https://www.tekscan.com/
- Evidence/access: Manufacturer; search excerpt.
- Supports: Relative force measurement and dental occlusion assessment.

### S07 — Bruxoff versus polysomnography study

- URL: https://pubmed.ncbi.nlm.nih.gov/24417585/
- Evidence/access: Original study; indexed abstract.
- Supports: Portable masseter EMG and heart-rate recordings compared with PSG.

### S08 — Diagnostic accuracy of Bruxoff

- URL: https://pubmed.ncbi.nlm.nih.gov/36648354/
- Evidence/access: Original study; search excerpt; direct open incomplete.
- Supports: Independent validation exists; no pooled performance extracted.

### S09 — Osstell clinical guidelines

- URL: https://www.osstell.com/clinical-guidelines/
- Evidence/access: Manufacturer; search excerpt.
- Supports: RFA produces implant stability quotient.

### S10 — Reliability of Osstell and Penguin RFA

- URL: https://pubmed.ncbi.nlm.nih.gov/29762187/
- Evidence/access: Original study; indexed abstract.
- Supports: Implant stability device reliability.

### S11 — Comparison of LDF, pulse oximetry and electric pulp testing

- URL: https://pubmed.ncbi.nlm.nih.gov/20868433/
- Evidence/access: Original study; indexed abstract.
- Supports: Pulp testing comparison.

### S12 — Pulse oximetry after dental trauma

- URL: https://pubmed.ncbi.nlm.nih.gov/17437866/
- Evidence/access: Original study; indexed abstract.
- Supports: Custom dental pulse-oximetry probe, electrical and thermal comparison.

### S13 — Disposable salivary MMP-8 immunosensor

- URL: https://discovery.ucl.ac.uk/id/eprint/10190334/
- Evidence/access: Original study institutional record; search excerpt.
- Supports: Electrochemical electrode functionalized for MMP-8 detection.

### S14 — SAW MMP-8 prototype

- URL: https://pubmed.ncbi.nlm.nih.gov/31363141/
- Evidence/access: Original study; indexed abstract.
- Supports: Saliva from periodontal health, gingivitis and periodontitis groups; compared with ELISA.

### S15 — Wearable MIP MMP-8 electrochemical sensor

- URL: https://pubmed.ncbi.nlm.nih.gov/40714834/
- Evidence/access: Original study; indexed abstract.
- Supports: Research platform; does not establish routine continuous clinical use.

### S16 — Intraoral micro-pH measurement of carious lesions

- URL: https://pubmed.ncbi.nlm.nih.gov/22222970/
- Evidence/access: Original study; indexed abstract.
- Supports: Clinical lesion-surface pH measurement alongside bacterial analysis.

### S17 — O-pH biofilm acidity prototype

- URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC9509691/
- Evidence/access: Original study; retrieved indexed excerpt.
- Supports: Optical biofilm pH assessment; further utility studies needed.

### S18 — Continuous pH wearable clinical pilot

- URL: https://www.sciencedirect.com/science/article/pii/S2950643326000164
- Evidence/access: Original study; search excerpt only; direct open 403.
- Supports: Pilot reported 48-hour pH monitoring; limited retrieval.

### S19 — Electrochemical multiplex oral cancer biomarker sensor

- URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC2799532/
- Evidence/access: Original study; indexed excerpt.
- Supports: IL-8 protein and mRNA; 56 clinical saliva samples.

### S20 — Photoacoustic periodontal imaging first human study

- URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC6226559/
- Evidence/access: Original study; indexed excerpt.
- Supports: Pocket depth imaging feasibility, not routine clinical replacement.

### S21 — Posterior periodontal PA/US transducer

- URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC9530592/
- Evidence/access: Original study; indexed excerpt.
- Supports: Compact transducer and human feasibility results.

### S22 — Wireless orthodontic force measurements in aligners

- URL: https://www.sciencedirect.com/science/article/pii/S2590093523000772
- Evidence/access: Original study; indexed excerpt.
- Supports: Flexible LC sensor tested on a dental model.

### S23 — All-in-one iontronic orthodontic sensing aligner

- URL: https://pubmed.ncbi.nlm.nih.gov/40916927/
- Evidence/access: Original study; indexed abstract.
- Supports: Wireless force monitoring; in-vivo report, species/population not verified here.

### S24 — Schick AE operating instructions

- URL: https://www.dentsplysironasupport.com/content/dam/master/product-procedure-brand-categories/imaging/product-categories/software/schick-software/Schick_AE_Operating_Manual_English.pdf
- Evidence/access: Manufacturer manual; indexed excerpt; direct open too large.
- Supports: Digital intraoral X-ray images including proximal caries assessment.

### S25 — Schick intraoral imaging in restorative workflow

- URL: https://www.dentsplysirona.com/en-us/discover/discover-by-procedure/ds-signature-workflows/ds-signature-workflows-indirect-restorations.html
- Evidence/access: Manufacturer; indexed excerpt.
- Supports: Periapical imaging within a clinical restorative workflow.

### S26 — Ex-vivo comparison of dental radiographic systems

- URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC4846148/
- Evidence/access: Original study; indexed excerpt.
- Supports: Digital detector caries study; ex-vivo evidence.

### S27 — Graphene tooth-mounted bacterial sensor

- URL: https://www.nature.com/articles/ncomms1767
- Evidence/access: Original study; indexed excerpt.
- Supports: Proof of concept included bovine-tooth transfer, not validated human disease diagnosis.


## Search limitations

This is a selected landscape inventory, not an exhaustive list. Most records were assessed through retrieved search excerpts or indexed abstracts, not full-text methodological appraisal. Direct-open failures are documented in the search log. Broad reviews were used for discovery only; inventory claims are linked to original studies, manufacturer information or regulatory records. Publication-date labels supplied by search engines can be inconsistent; bibliographic details must be checked before a manuscript citation. Temperature-only, salivary-flow, volatile-gas, OCT and tooth-mobility systems need a subsequent focused search before detailed inclusion.
