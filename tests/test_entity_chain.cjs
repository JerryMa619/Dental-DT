const assert=require('node:assert/strict'),fs=require('node:fs');
const {build}=require('../web/entity-chain.js');const d=JSON.parse(fs.readFileSync('web/data.json'));
let total=0;
for(const user of new Set(d.checkins.map(c=>c.patient_id))){let previous=null;for(const c of d.checkins.filter(c=>c.patient_id===user)){
 const original=JSON.stringify(c),events=build(c,previous),ids=new Set(events.map(e=>e.id));
 assert.equal(ids.size,events.length);assert.deepEqual(new Set(events.map(e=>e.owner)),new Set(['UE','CSE','DTE','DCDCE']));
 assert.equal(events.some(e=>e.title==='Replay DT snapshot update'),c.observation.available);
 assert.equal(events.some(e=>e.title==='Check professional collaboration boundary'),c.priority==='professional-review');
 for(let i=0;i<events.length;i++){assert.equal(events[i].input_event_id,i?events[i-1].id:null);assert(events[i].input&&events[i].output);assert(events[i].ontology.length);}
 assert.equal(events.find(e=>e.title==='Display assessment and actions').output.actions.length,c.recommendations.length);
 assert.equal(events.find(e=>e.title==='Check advice traceability').output.all_advice_linked,true);
 assert.equal(events.find(e=>e.title==='Replay rule assessment').output.history_used_by_rules,false);
 assert.equal(JSON.stringify(c),original);total+=events.length;previous=c;
}}
const c=structuredClone(d.checkins[0]);c.priority='emergency-review';c.symptom_report.values.breathing_or_swallowing_difficulty=true;
assert(!build(c,null).some(e=>[1,2,3,4,5,9].includes(e.stage)));
assert.throws(()=>build(c,{patient_id:'OTHER'}),/mismatch/);
const rows=d.checkins.filter(c=>c.patient_id==='SYN-000'),temp=structuredClone(rows[1]);temp.feedback_simulation=true;temp.adherence_status='reported';temp.adherence_feedback=[{recommendation_id:rows[0].recommendations[0].recommendation_id,status:'reported-completed',reported_at:temp.captured_at}];
const ev=build(temp,rows[0]);assert(ev.find(e=>e.title==='Check feedback references').output.all_links_match_prior_check);assert.equal(ev.find(e=>e.title==='Record feedback and pending limits').output.feedback_persisted_in_source_record,false);assert.equal(ev.find(e=>e.title==='Record feedback and pending limits').output.advice_recalculated_from_feedback,false);
console.log('PASS: '+total+' entity events across '+d.checkins.length+' recorded checks; evidence, branch order, emergency, identity rejection, immutable inputs and temporary feedback.');
