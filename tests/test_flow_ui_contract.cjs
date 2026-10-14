const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const flow=require('../web/flow-state.js'),data=JSON.parse(fs.readFileSync('web/data.json'));
let advances=0;
for(const c of data.checkins){const r=flow.route(c);assert.equal(r.includes(4),c.observation.available);assert.equal(r.includes(9),!c.observation.available);assert.equal(r.includes(10),c.priority==='professional-review');}
for(const user of new Set(data.checkins.map(c=>c.patient_id))){const rows=data.checkins.filter(c=>c.patient_id===user);let state={day:0,phase:0},guard=0;while(!state.done){state=flow.next(rows,state);assert(++guard<1000);}advances+=guard;}
const emergency=JSON.parse(JSON.stringify(data.checkins[0]));emergency.symptom_report.values.breathing_or_swallowing_difficulty=true;emergency.priority='emergency-review';
for(const available of [true,false]){emergency.observation.available=available;assert.deepEqual(flow.route(emergency),[0,6,7,10,8,11]);}
const html=fs.readFileSync('web/index.html','utf8'),ids=new Set([...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1])),els={};let tick,raf;
for(const id of ids)els[id]={value:id==='speed'?'3500':id==='user'?'SYN-000':0,innerHTML:'',style:{},classList:{toggle(){}},querySelectorAll(){return[]},click(){this.onclick?.()}};
const ctx={console,document:{getElementById(id){assert(ids.has(id),'Missing DOM '+id);return els[id]},querySelectorAll(){return[]}},requestAnimationFrame(fn){raf=fn;return 1},setInterval(fn){tick=fn;return 1},clearInterval(){tick=null},fetch:()=>Promise.resolve({ok:true,json:()=>Promise.resolve(data)}),Blob,URL};
ctx.window=ctx;vm.createContext(ctx);
for(const f of ['flow-state.js','scan-scene.js','entity-chain.js','data-sync.js','app.js'])vm.runInContext(fs.readFileSync('web/'+f,'utf8'),ctx);
setImmediate(()=>{
 assert(els.scanScene.innerHTML.includes('Target tooth 46'));assert(!els.scanScene.innerHTML.includes('scan coverage'));
 els.play.click();tick();assert.equal(els.liveTitle.textContent,'Acquisition');raf(1);raf(1000);els.play.click();const old=els.scanScene.innerHTML;raf(1700);assert.equal(els.scanScene.innerHTML,old);
 vm.runInContext('selectStage(6);',ctx);els.step.click();assert.equal(els.liveTitle.textContent,'Advice');
 els.reset.click();assert.equal(els.liveTitle.textContent,'Home check-in');
 const original=data.checkins.filter(c=>c.patient_id==='SYN-000');
 const raw=JSON.stringify(original[1]);
 vm.runInContext('day=1;replayPhase=0;stage=0;render();',ctx);
 els.entityDemoFeedback.click();
 assert(els.entityScenarioNote.textContent.includes('Temporary feedback scenario'));
 assert.equal(JSON.stringify(original[1]),raw);
 assert(els.entityOutput.textContent.includes('reported-completed'));
 els.entityClearFeedback.click();assert(els.entityScenarioNote.textContent.includes('recorded synthetic data'));
 vm.runInContext('day=0;replayPhase=0;stage=0;render();',ctx);

 vm.runInContext('globalThis.testRows=rows;globalThis.testScene=ScanScene;',ctx);
 // Inject a requirement case; it does not enter the published dataset.
 ctx.testRows[0]=emergency;els.reset.click();els.step.click();assert.equal(els.liveTitle.textContent,'Assessment');
 vm.runInContext('selectStage(4);',ctx);assert.equal(els.liveTitle.textContent,'Assessment');assert(els.status.textContent.includes('skipped'));
 assert(!els.scanScene.innerHTML.includes('Record linked to a DT snapshot'));
 vm.runInContext("ontologyGraph();",ctx);assert(els.ontologyGraph.innerHTML.includes('marker-end'));assert(els.ontologyGraph.innerHTML.includes('ddt:forPatient'));
 console.log('PASS: '+advances+' replay advances; emergency bypass, conditional handoff, manual-stage alignment, skipped-stage guard, pause, single-tooth scope and directed ontology DOM contracts.');
});
