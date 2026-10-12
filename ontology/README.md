# Dental DT Ontology v0.1

Status: executable draft schema with synthetic instance and SHACL validation. No clinical model or disease classifier is implemented.

## Files

- [ddt-core.ttl](ddt-core.ttl): OWL/RDFS classes and properties.
- [ddt-shapes.ttl](ddt-shapes.ttl): project data constraints.
- [Synthetic scan](examples/synthetic-scan.ttl): fictional, nonclinical example.
- [Competency queries](competency-queries.rq): SPARQL examples.
- [Validation script](../scripts/validate_ontology.py): positive and negative checks.

## Modules

| Module | Classes |
|---|---|
| Architecture context | OME and its eight categories; FrameworkEntity, DCDCE, CoreEntity, UserEntity, CrossSystemEntity |
| Clinical extension | Patient, OralCavity, Tooth, ToothSurface, GingivalRegion |
| Acquisition | DentalDevice, Sensor, ScanSession, Observation, MeasurementResult, DataArtifact, QualityAssessment |
| Twin lifecycle | DigitalTwin, TwinSnapshot, AnalysisRun, ModelVersion |
| Interpretation and actions | Finding, ClinicalAssessment, ClinicianDiagnosis, Recommendation, TreatmentPlan, Intervention, ConditionConcept, ActionConcept |

OME is physical context, not asserted as a subclass of FrameworkEntity. Patient and anatomy are not subclasses of Product. Architecture classes describe logical roles and are not a fully instantiated deployment.

## Key relations

Patient hasOralCavity; structures partOf/belongsToPatient; device hasSensor; scan forPatient/usesDevice; observation madeBySensor/hasFeatureOfInterest/observedProperty/hasResult; twin representsPatient/hasSnapshot; snapshot previousSnapshot/wasDerivedFrom; finding aboutStructure/hasEvidence/suggestsCondition; assessment assessesSnapshot/hasEvidence; recommendation basedOnAssessment/proposesAction.

Observation time and result time are separate. Numeric quantities use numericValue/unitCode when available; image observations reference artifacts and need not fabricate a numeric value. Calibration is initially recorded at device level; immutable per-session calibration provenance remains a next-version refinement.

## Semantic choices

Reuse [SOSA/SSN](https://www.w3.org/TR/vocab-ssn/), PROV-O and OWL-Time vocabulary references. SHACL follows [W3C SHACL](https://www.w3.org/TR/shacl/). This draft does not import external ontologies or claim complete alignment. Clinical terminology mappings, formal tooth/surface code constraints, specimen modelling, validated uncertainty representations and model inputs/outputs remain future work.

The namespace https://w3id.org/dental-dt/ontology# is proposed and not registered. Instances use https://example.org/ddt/ and contain no real patient data.

## Competency questions

1. Which tooth/surface was observed, by which sensor and when?
2. Which scan quality record accompanies it?
3. Which evidence and model produced a finding?
4. Which snapshot/assessment supports a recommendation?
5. Was an interpretation reviewed, and by whom?
6. How do successive snapshots relate?

The first three executable query patterns are provided; review and temporal-change queries should be expanded when those instance records exist.

## Validation

Install requirements and run: `python scripts/validate_ontology.py` from repository root.

Tests cover Turtle parsing, synthetic-data SHACL conformance, missing-observation-result rejection, coverage outside [0,1] rejection, clinician diagnosis without reviewer rejection, and SPARQL evidence retrieval. RDFS inference is used; no full OWL consistency proof or clinical validation is claimed.
