"""Build the static explorer payload from current synthetic shards."""
import json
from pathlib import Path
from rdflib import Graph, RDF, OWL
from prototype.integrate_daily import integrate
from evaluation.run_benchmark import run
ROOT = Path(__file__).resolve().parents[1]
rows = [json.loads(line) for p in sorted((ROOT/"datasets/synthetic/daily").glob("*.jsonl"))
        for line in p.read_text().splitlines() if line.strip()]
_, checkins, summary = integrate(rows)
g = Graph()
for f in ("ddt-core.ttl","ddt-home-extension.ttl"):
    g.parse(ROOT/"ontology"/f)
payload = {"checkins":checkins,"summary":summary,"benchmark":run(),
           "ontology": sorted(str(c).split("#")[-1] for c in g.subjects(RDF.type,OWL.Class))}
path = ROOT/"web/data.json"
path.write_text(json.dumps(payload))
print(f"Exported {len(checkins)} check-ins to {path}")
