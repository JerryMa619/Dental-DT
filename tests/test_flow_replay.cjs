const assert=require('node:assert/strict'), fs=require('node:fs');
const flow=require('../web/flow-state.js');
const data=JSON.parse(fs.readFileSync('web/data.json','utf8'));
let transfers=0;
for(const user of new Set(data.checkins.map(c=>c.patient_id))){
 const rows=data.checkins.filter(c=>c.patient_id===user);
 let state={day:0,phase:0,done:false},guard=0;
 while(!state.done){
  const row=rows[state.day], route=flow.route(row);
  assert.equal(route[0],0);assert.equal(route.at(-1),11);
  assert.equal(route.includes(4),row.observation.available);
  assert.equal(route.includes(9),!row.observation.available);
  assert(route.includes(6)&&route.includes(7)&&route.includes(8));
  assert.equal(route.includes(10),row.priority==='professional-review'||flow.emergency(row));
  state=flow.next(rows,state);transfers++;if(++guard>1000)throw Error('Replay did not terminate');
 }
 assert.equal(state.day,rows.length-1);
}
console.log('PASS: 30 patient replays, accepted/rejected branches, '+transfers+' replay advances');
