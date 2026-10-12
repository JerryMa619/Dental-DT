"""Validate the draft ontology and synthetic graph; not clinical validation."""
from pathlib import Path
from rdflib import Graph, Namespace, RDF, Literal
from rdflib.namespace import XSD
from pyshacl import validate

ROOT = Path(__file__).resolve().parents[1]
DDT = Namespace("https://w3id.org/dental-dt/ontology#")
EX = Namespace("https://example.org/ddt/")
SOSA = Namespace("http://www.w3.org/ns/sosa/")
ontology = Graph().parse(ROOT / "ontology/ddt-core.ttl", format="turtle")
shapes = Graph().parse(ROOT / "ontology/ddt-shapes.ttl", format="turtle")
data = Graph().parse(ROOT / "ontology/examples/synthetic-scan.ttl", format="turtle")

def conforms(graph):
    return validate(graph, shacl_graph=shapes, ont_graph=ontology,
                    inference="rdfs", abort_on_first=False)[0]

def copy_graph():
    result = Graph()
    for triple in data:
        result.add(triple)
    return result

assert conforms(data), "Synthetic example fails SHACL"
bad = copy_graph()
bad.remove((EX.observation, SOSA.hasResult, None))
assert not conforms(bad), "Missing result was not rejected"
bad = copy_graph()
bad.set((EX.quality, DDT.coverageFraction, Literal("1.1", datatype=XSD.decimal)))
assert not conforms(bad), "Out-of-range coverage was not rejected"
bad = copy_graph()
bad.add((EX.assessment, RDF.type, DDT.ClinicianDiagnosis))
assert not conforms(bad), "Diagnosis without reviewer was not rejected"
queries = (ROOT / "ontology/competency-queries.rq").read_text().split("# Finding provenance")
q1 = queries[0]
remainder = queries[1].split("# Recommendation evidence chain")
for query in (q1, remainder[0], remainder[1]):
    assert len(list(data.query(query))) == 1, "Expected synthetic evidence chain missing"
assert (DDT.Patient, __import__("rdflib").RDFS.subClassOf, DDT.Product) not in ontology
print(f"PASS: Turtle parsing ({len(ontology)} ontology, {len(shapes)} shape, {len(data)} example triples)")
print("PASS: positive SHACL + 3 negative constraint checks + 3 competency queries")
