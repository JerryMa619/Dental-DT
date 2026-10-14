"""Build the static explorer payload from current synthetic shards."""
import json
import hashlib
import re
from pathlib import Path
from prototype.integrate_daily import integrate
from evaluation.run_benchmark import run
ROOT = Path(__file__).resolve().parents[1]
rows = [json.loads(line) for p in sorted((ROOT/"datasets/synthetic/daily").glob("*.jsonl"))
        for line in p.read_text().splitlines() if line.strip()]
_, checkins, summary = integrate(rows)
classes = set()
for f in ("ddt-core.ttl", "ddt-home-extension.ttl"):
    # Inventory only: these maintained files declare one named class per line.
    # This is not RDF parsing, inference or SHACL validation.
    text = (ROOT / "ontology" / f).read_text()
    classes.update(re.findall(r"^ddt:(\w+)\s+a\s+owl:Class\s*[;. ]", text, re.M))
if not classes:
    raise ValueError("No declared ontology classes found")
manifest = json.loads((ROOT / "datasets/synthetic/manifest.json").read_text())
if len(checkins) != manifest["total_records"]:
    raise ValueError("Manifest and explorer record counts disagree")
payload = {"checkins":checkins,"summary":summary,"benchmark":run(),
           "ontology": sorted(classes)}
version = hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()
payload["metadata"] = {"synthetic": True, "data_version": version,
                       "dataset_through": manifest["last_updated_date"],
                       "timezone": "Europe/London", "cohort_size": manifest["cohort_size"],
                       "source_repository": "JerryMa619/Dental-DT",
                       "ontology_inventory_method": "named declarations; not RDF/SHACL validation"}
path = ROOT/"web/data.json"
path.write_text(json.dumps(payload) + "\n")
print(f"Exported {len(checkins)} check-ins to {path}")
