# Validation Record

Date: 2026-10-12. Command: `python scripts/validate_ontology.py`.

Result: PASS.

- Parsed 220 ontology triples, 140 shape triples and 69 synthetic example triples.
- Synthetic graph conforms using RDFS inference.
- Missing observation result rejected.
- Coverage above 1 rejected.
- Clinician diagnosis without reviewer rejected.
- Three SPARQL competency queries each retrieved the expected synthetic row.

This checks a draft graph and selected constraints, not full OWL consistency, clinical inference or all production data scenarios.
