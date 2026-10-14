'use strict';
let data, rows=[], current, day=0, stage=0, timer=null;
const $=id=>document.getElementById(id);
const names=['Home check-in','Acquisition','Quality gate','Observation','Twin snapshot','Comparison','Assessment','Advice','Follow-up'];
const entities=['UE + clinical extension','DCDCE','DCDCE / CSE','SOSA / DCDCE','CE','CE','CE','CE → UE','UE → CE'];
const descriptions=[
'Patient, time and symptoms enter together. Symptom warnings are checked before illustrative scanning. All identities are fictional.',
'Only synthetic structured signals exist. Physical scanner, RGB and geometry are not implemented.',
'Quality is supplied by the generator. Rejected data create no new snapshot.',
'Accepted procedural scores carry anatomical site and evidence identity; not measured clinical properties.',
'Accepted observations update a versioned patient state. Rejected checks retain the previous snapshot reference.',
'Compare with the immediately preceding same-patient check, provided the site matches and both observations are available. This is not a last-valid-baseline search; trends do not feed advice yet.',
'Draft rules use current symptoms and accepted simulated scores. Trends, snapshots and adherence are not rule inputs yet. Emergency symptoms take precedence over scan quality.',
'Recommendations carry rule IDs, source links and evidence references. No actual messages are sent.',
'Feedback is linked to the immediately prior check-in’s recommendations when supplied. It is recorded, not used to revise advice. Current daily data contain no adherence reports.'
];
const entitiesInfo=[
['OME','Observable context','Eight manufacturing categories plus explicit patient/anatomy extension.','Physical scanner remains proposed.'],
['DCDCE','Acquisition & control','Scan session, region identity, supplied quality and observation transfer.','Device interfaces not implemented.'],
['CE','Core twin services','Snapshots, history, signal comparison, draft assessment and advice.','Synthetic JSON pipeline implemented.'],
['UE','User interaction','Home scanning, advice review, feedback and clinician interface.','This explorer is a research presentation.'],
['CSE','Cross-system functions','Identity, semantic mapping, quality assurance, provenance and security.','Evidence IDs implemented; production security pending.']
];
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function pretty(x){return JSON.stringify(x,null,2);}
function initialise(d){
 if(!Array.isArray(d.checkins)||!d.checkins.length||!d.summary||!d.benchmark||!Array.isArray(d.ontology))throw Error('Expected exported explorer dataset');
 if(d.checkins.some(c=>!c.synthetic||!c.observation||!Array.isArray(c.recommendations)))throw Error('Synthetic check-ins required');
 data=d;const users=[...new Set(d.checkins.map(r=>r.patient_id))].sort();
 $('user').innerHTML=users.map(u=>'<option>'+esc(u)+'</option>').join('');
 $('metrics').innerHTML=[[users.length,'VIRTUAL USERS'],[d.checkins.length,'DAILY CHECK-INS'],[d.summary.snapshots,'DT SNAPSHOTS'],[d.summary.recommendations,'DRAFT RECOMMENDATIONS']].map(([n,t])=>'<div class="metric"><strong>'+esc(n)+'</strong><span>'+t+'</span></div>').join('');
 $('entityCards').innerHTML=entitiesInfo.map(([id,title,text,state])=>'<article><b>'+id+'</b><h3>'+title+'</h3><p>'+text+'</p><span class="tag">'+state+'</span></article>').join('');
 $('omeCategories').innerHTML=['Personnel','Equipment','Material','Process','Facility','Environment','Product','Supporting document'].map(t=>'<span class="chip">'+t+'</span>').join('');
 $('classCount').textContent=d.ontology.length+' draft OWL classes';
 $('vocabulary').innerHTML=d.ontology.map(t=>'<span class="chip">'+esc(t)+'</span>').join('');
 $('benchScore').innerHTML='<span class="tag">'+d.benchmark.passed+' / '+d.benchmark.scenario_count+' scenarios met</span> <span class="tag fail">'+d.benchmark.failed+' gap</span>';
 $('benchRows').innerHTML=d.benchmark.results.map(r=>'<tr><td><b>'+esc(r.id)+'</b> '+esc(r.name)+'</td><td>'+esc(r.expected_priority)+'</td><td>'+esc(r.actual_priority)+'</td><td><span class="tag '+(r.passed?'':'fail')+'">'+(r.passed?'PASS':'GAP')+'</span></td></tr>').join('');
 $('freshness').textContent='Data snapshot through '+d.checkins.map(c=>c.captured_at.slice(0,10)).sort().at(-1)+' · '+d.summary.integration_version;
 chooseUser();ontologyGraph();
}
function chooseUser(){stop();rows=data.checkins.filter(r=>r.patient_id===$('user').value).sort((a,b)=>a.captured_at.localeCompare(b.captured_at));day=0;replayPhase=0;stage=0;replayEvents=[];lastTransfer=null;$('day').max=rows.length-1;render();}
function render(){
 current=rows[day];$('day').value=day;$('dateLabel').textContent=current.captured_at.slice(0,10);
 $('recordBadge').innerHTML='<span class="tag '+(current.observation.available?'':'warn')+'">'+(current.observation.available?'Accepted observation':'Rejected acquisition')+'</span>';
 $('flowNodes').innerHTML=names.map((n,i)=>'<button class="node '+(i===stage?'selected':'')+'" data-stage="'+i+'"><span class="num">0'+(i+1)+' / '+entities[i]+'</span><span class="arrow">↘</span><b>'+n+'</b><small>'+nodeValue(i)+'</small></button>').join('');
 $('flowNodes').querySelectorAll('button').forEach(b=>b.onclick=()=>selectStage(Number(b.dataset.stage)));
 inspect();chart();
 const c=current.longitudinal_comparison||{status:'not-computed'};
 $('comparison').innerHTML='<span class="tag">'+esc(c.status)+'</span><p class="sub">Compared with '+esc(c.previous_checkin_id||'no prior baseline')+'. Changes have no established clinical meaning.</p>'+Object.entries(c.metrics||{}).map(([k,v])=>'<div class="sub">'+esc(k)+' · '+esc(v.direction)+' · Δ '+esc(v.delta)+'</div>').join('');
 $('feedback').innerHTML='<span class="tag">'+esc(current.adherence_status||'not-reported')+'</span><p class="sub">No feedback is inferred from a lower signal. Reports do not prove execution or a causal effect.</p>';
 ontologySelect(liveConcepts[stage]||'Patient');liveFlow();
}
function nodeValue(i){return [current.patient_id,current.observation.site.tooth_code+' / '+current.observation.site.surface,current.quality_record.status,current.observation.available?'Procedural signals available':'No accepted signals',current.snapshot_id||'No new snapshot',current.longitudinal_comparison?.status||'Not computed',current.priority,current.recommendations.length+' evidence-linked actions',current.adherence_status||'not-reported'][i];}
function stageData(i){return [
 {patient_id:current.patient_id,checkin_id:current.checkin_id,captured_at:current.captured_at,symptom_report:current.symptom_report},
 {session_id:current.session_id,site:current.observation.site,physical_scanner:false,image_available:false,geometry_available:false},
 current.quality_record,current.observation,
 {snapshot_id:current.snapshot_id,previous_snapshot_id:current.previous_snapshot_id,previous_checkin_id:current.previous_checkin_id},
 current.longitudinal_comparison,current.assessment,current.recommendations,
 {adherence_status:current.adherence_status,adherence_feedback:current.adherence_feedback,notification:current.notification}
 ][i];}
function inspect(){$('detailTitle').textContent=liveLabels[stage];$('detailDescription').textContent=liveNarration(stage);$('detailJson').textContent=pretty(liveStagePayload(stage));}
function chart(){
 const W=560,H=190,p=28,n=rows.length,x=i=>p+i*(W-2*p)/Math.max(n-1,1),y=v=>H-p-v*(H-2*p);
 let svg='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Synthetic deposit and redness score history">';
 [0,.5,1].forEach(v=>svg+='<line x1="'+p+'" y1="'+y(v)+'" x2="'+(W-p)+'" y2="'+y(v)+'" stroke="#e1e7dc"/><text x="4" y="'+(y(v)+4)+'" font-size="9" fill="#65756e">'+v+'</text>');
 svg+='<line x1="'+x(day)+'" y1="12" x2="'+x(day)+'" y2="'+(H-p)+'" stroke="#b4c9aa" stroke-dasharray="3 3"/>';
 [['deposit_score','#168375'],['redness_score','#8171a6']].forEach(([k,color])=>{
 let last=null;rows.forEach((r,i)=>{const v=r.observation.available?r.observation.values[k]:null;if(v===null){last=null;return;}if(last)svg+='<line x1="'+last[0]+'" y1="'+last[1]+'" x2="'+x(i)+'" y2="'+y(v)+'" stroke="'+color+'" stroke-width="2"/>';svg+='<circle cx="'+x(i)+'" cy="'+y(v)+'" r="3.5" fill="'+color+'"><title>'+esc(r.captured_at.slice(0,10))+' '+k+': '+v+'</title></circle>';last=[x(i),y(v)];});});
 rows.forEach((r,i)=>{svg+='<text x="'+x(i)+'" y="'+(H-7)+'" text-anchor="middle" font-size="9" fill="#65756e">'+esc(r.captured_at.slice(5,10))+'</text>';if(!r.observation.available)svg+='<text x="'+x(i)+'" y="'+(H-p-5)+'" text-anchor="middle" fill="#a96523">×</text>';});
 $('chart').innerHTML=svg+'</svg>';
}
const graphNodes=[
 ['Patient',90,50,'The fictional person linked to check-ins and the digital twin.'],
 ['ScanSession',280,50,'The capture event, date and device context.'],
 ['SymptomReport',470,50,'Reported symptoms are distinct from sensor observations.'],
 ['ToothSurface',90,160,'An anatomical feature, not a manufactured product.'],
 ['Observation',280,160,'Site-linked synthetic values and provenance.'],
 ['QualityAssessment',470,160,'Supplied quality determines observation usability.'],
 ['TwinSnapshot',90,275,'Versioned digital state; rejected checks create no new state.'],
 ['ClinicalAssessment',280,275,'Draft evidence-linked evaluation, not a diagnosis.'],
 ['Recommendation',470,275,'Actions cite evidence and a draft rule/protocol.'],
 ['ModelVersion',90,385,'Model/protocol version: no image model implemented.'],
 ['AdviceProtocol',280,385,'Rules and source guidance used for advice.'],
 ['FollowUpRecord',470,385,'History comparison and explicitly reported feedback.']
];
function ontologyGraph(){
 const edges=[[1,0,'ddt:forPatient'],[4,1,'ddt:inSession'],[2,0,'ddt:reportedByPatient'],[4,3,'sosa:hasFeatureOfInterest'],[1,5,'ddt:hasQualityAssessment'],[6,4,'prov:wasDerivedFrom'],[7,6,'ddt:assessesSnapshot'],[7,4,'ddt:hasEvidence'],[8,7,'ddt:basedOnAssessment'],[8,10,'ddt:usesAdviceProtocol'],[11,7,'ddt:followsAssessment'],[11,2,'ddt:hasSymptomReport']];
 let s='<svg viewBox="0 0 560 435" role="img" aria-label="Directed ontology predicates from subject to object"><defs><marker id="ontologyTip" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#7b9788"/></marker></defs>';
 edges.forEach(([a,b,t])=>{const A=graphNodes[a],B=graphNodes[b],dx=B[1]-A[1],dy=B[2]-A[2],scale=Math.max(Math.abs(dx)/70,Math.abs(dy)/20),x=B[1]-dx/scale,y=B[2]-dy/scale;s+='<line x1="'+A[1]+'" y1="'+A[2]+'" x2="'+x+'" y2="'+y+'" stroke="#a3b8ac" stroke-width="1.5" marker-end="url(#ontologyTip)"/><text x="'+((A[1]+B[1])/2)+'" y="'+((A[2]+B[2])/2-7)+'" text-anchor="middle" font-size="7" fill="#567465">'+t+'</text>';});
 graphNodes.forEach(([name,x,y])=>s+='<g class="concept" data-concept="'+name+'" tabindex="0" role="button" aria-label="'+name+'"><rect x="'+(x- seventy())+'" y="'+(y-20)+'" width="140" height="40" rx="8" fill="#edf4e7" stroke="#abc6a1"/><text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" font-size="10" fill="#18332e">'+name+'</text></g>');
 $('ontologyGraph').innerHTML=s+'</svg>';
 $('ontologyGraph').querySelectorAll('[data-concept]').forEach(n=>{n.onclick=()=>ontologySelect(n.dataset.concept);n.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();ontologySelect(n.dataset.concept);}};});
}
function seventy(){return 70;}
function ontologySelect(name){const n=graphNodes.find(x=>x[0]===name);if(!n)return;$('ontologyTitle').textContent=name;$('ontologyDescription').textContent=n[3];
 const mapping={Patient:{id:current.patient_id},ScanSession:stageData(0),SymptomReport:current.symptom_report,ToothSurface:current.observation.site,Observation:current.observation,QualityAssessment:current.quality_record,TwinSnapshot:stageData(4),ClinicalAssessment:current.assessment,Recommendation:current.recommendations,ModelVersion:{integration_version:data.summary.integration_version,clinical_model:false},AdviceProtocol:{rules:current.recommendations.map(r=>({rule_id:r.rule_id,source:r.source}))},FollowUpRecord:stageData(8)};
 $('ontologyJson').textContent=pretty(mapping[name]);}
function stop(){if(timer)clearInterval(timer);timer=null;$('play').textContent='▶ Play scan pipeline';ScanScene.pause();EntityChain.pause();}
$('user').onchange=chooseUser;
$('day').oninput=()=>{stop();day=Number($('day').value);replayPhase=0;stage=0;replayEvents=[];lastTransfer=null;render();};
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('nav button').forEach(n=>n.classList.toggle('active',n===b));document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===b.dataset.tab));});
$('download').onclick=()=>{const url=URL.createObjectURL(new Blob([pretty(current)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=current.patient_id+'-'+current.captured_at.slice(0,10)+'.json';a.click();URL.revokeObjectURL(url);};
$('importData').onchange=async e=>{try{stop();initialise(JSON.parse(await e.target.files[0].text()));dataOrigin='Imported local snapshot';showFreshness();$('status').textContent='Loaded local synthetic explorer data. No data uploaded.';}catch(err){$('status').textContent='Could not load data: '+err.message;}};

// Full-process replay. Each stage exposes recorded evidence, including blocked branches.
let replayPhase=0, replayEvents=[], lastTransfer=null;
const liveLabels=[...names,'Rescan requested','Dentist handoff','Next daily check'];
const liveConcepts=['Patient','ScanSession','QualityAssessment','Observation','TwinSnapshot','FollowUpRecord','ClinicalAssessment','Recommendation','FollowUpRecord','QualityAssessment','Recommendation','ScanSession'];
const positions=[[85,65],[280,65],[475,65],[670,65],[670,210],[475,210],[280,210],[85,210],[85,355],[475,140],[280,355],[670,355]];
function liveStagePayload(s){
 if(s===9)return {branch:'quality-rejected',action:'request targeted rescan',recorded_response:'No same-day rescan in this dataset',new_snapshot:false};
 if(s===10)return {priority:current.priority,notification:current.notification,channel_connected:false,mode:'professional-review interface only; no message transmitted',authorization:'not captured',delivery_receipt:null,clinician_response:null};
 if(s===11)return {next_record:rows[day+1]?.checkin_id||null,feedback:current.adherence_status,next_day_is_recorded:!!rows[day+1]};
 return stageData(s);
}
function liveNarration(s){
 if(s===9)return 'Quality failed → request a rescan. No replacement measurement is fabricated. Symptoms still enter assessment.';
 if(s===10)return 'Professional-review interface is shown only when review is advised. Dentist binding, consent, delivery and clinician response are not implemented. No message is sent; emergency advice must not wait for this interface.';
 if(s===11)return 'Close this check-in and move to the next recorded day. Feedback remains unknown unless explicitly reported.';
 return descriptions[s];
}
function flowPath(a,b){
 const A=positions[a],B=positions[b];
 return 'M '+A[0]+' '+A[1]+' L '+B[0]+' '+B[1];
}
function liveFlow(){
 EntityChain.update(current,rows[day-1]||null,stage,!!timer,Number($('speed').value));
 ScanScene.update(current,stage,!!timer,Number($('speed').value),FlowPlayback.route(current).slice(0,replayPhase+1).includes(4),FlowPlayback.route(current).slice(0,replayPhase+1).includes(1));
 const r=FlowPlayback.route(current), active=stage;
 const routePairs=r.slice(1).map((b,i)=>[r[i],b]);
 let svg='<svg viewBox="0 0 760 430" role="img" aria-label="Animated end-to-end dental twin data flow"><defs><marker id="tip" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="#8aa598"/></marker></defs>';
 svg+='<rect x="15" y="18" width="730" height="94" rx="14" fill="#e9f1e4"/><text x="25" y="33" font-size="9" fill="#6d8375">UE / PHYSICAL CONTEXT → DCDCE</text>';
 svg+='<rect x="15" y="164" width="730" height="94" rx="14" fill="#edf0f9"/><text x="25" y="180" font-size="9" fill="#6d8375">CE / STATE AND INTERPRETATION</text>';
 svg+='<rect x="15" y="306" width="730" height="94" rx="14" fill="#edf3e9"/><text x="25" y="322" font-size="9" fill="#6d8375">UE / ADVICE, FEEDBACK AND NEXT CHECK</text>';
 routePairs.forEach(([a,b])=>svg+='<path d="'+flowPath(a,b)+'" fill="none" stroke="'+((a===lastTransfer?.[0]&&b===lastTransfer?.[1])?'#168375':'#adc0b2')+'" stroke-width="2" marker-end="url(#tip)" opacity=".7"/>');
 const visible=new Set(r);
 positions.forEach(([x,y],i)=>{
 const skipped=!visible.has(i),on=i===active;
 svg+='<g class="live-node '+(on?'on':skipped?'skipped':'')+'" data-live-stage="'+i+'" role="button" tabindex="0" aria-label="'+liveLabels[i]+'"><rect x="'+(x-72)+'" y="'+(y-23)+'" width="144" height="46" rx="9" fill="'+(on?'#18332e':skipped?'#f0f1ed':'#fff')+'" stroke="'+(on?'#86cc76':skipped?'#d9ddd4':'#9db7a5')+'" stroke-width="'+(on?3:1)+'"/><text x="'+x+'" y="'+(y-3)+'" text-anchor="middle" font-size="10" font-weight="600" fill="'+(on?'#fff':skipped?'#9da89f':'#18332e')+'">'+liveLabels[i]+'</text><text x="'+x+'" y="'+(y+12)+'" text-anchor="middle" font-size="8" fill="'+(on?'#c7e7b8':'#728578')+'">'+(skipped?'skipped on this path':liveConcepts[i])+'</text></g>';
 });
 if(lastTransfer){
 const [a,b]=lastTransfer;
 svg+='<circle r="6" fill="#e5ab4c" stroke="#fff" stroke-width="2"><animateMotion dur="'+(Number($('speed').value)*.65)+'ms" repeatCount="1" fill="freeze" path="'+flowPath(a,b)+'"/></circle>';
 }
 svg+='</svg>';$('liveCanvas').innerHTML=svg;
 $('liveCanvas').querySelectorAll('[data-live-stage]').forEach(n=>{const inspectNode=()=>selectStage(Number(n.dataset.liveStage));n.onclick=inspectNode;n.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inspectNode();}};});
 $('liveTitle').textContent=liveLabels[active];
 $('liveNarration').textContent=liveNarration(active);
 $('livePacket').textContent=pretty(liveStagePayload(active));
 $('conceptNow').textContent='Ontology: '+liveConcepts[active];
 $('progressText').textContent='Day '+(day+1)+' / '+rows.length+' · stage '+(replayPhase+1)+' / '+r.length;
 $('executionLog').innerHTML=replayEvents.slice(-10).reverse().map(e=>'<li><span>'+esc(e.date)+'</span> '+esc(e.label)+'</li>').join('');
 const progress=(replayPhase+1)/r.length*100;$('flowProgress').style.width=progress+'%';
}
function selectStage(target){
 stop();const route=FlowPlayback.route(current),index=route.indexOf(target);
 if(index<0){$('status').textContent='This stage is skipped for the selected record; no transition performed.';return;}
 stage=target;replayPhase=index;lastTransfer=null;render();
}
function resetReplay(){stop();replayPhase=0;stage=0;replayEvents=[];lastTransfer=null;render();}
function advanceReplay(){
 const oldStage=stage, oldDay=day;
 const next=FlowPlayback.next(rows,{day,phase:replayPhase,done:false});
 if(next.done){stop();$('status').textContent='Full replay complete. No real scan, diagnosis or notification was performed. Replay order is a presentation, not a backend execution trace.';return;}
 day=next.day;replayPhase=next.phase;stage=FlowPlayback.route(rows[day])[replayPhase];
 lastTransfer=oldDay===day?[oldStage,stage]:null;
 replayEvents.push({date:rows[day].captured_at.slice(0,10),label:liveLabels[stage]+(stage===4?' → '+rows[day].snapshot_id:'')});
 render();
}
$('play').onclick=()=>{
 if(timer){stop();return;}
 const route=FlowPlayback.route(rows[day]);if(replayPhase>=route.length-1&&day===rows.length-1){day=0;resetReplay();}
 stage=FlowPlayback.route(rows[day])[replayPhase];
 if(!replayEvents.length)replayEvents.push({date:rows[day].captured_at.slice(0,10),label:liveLabels[stage]});
 $('play').textContent='Ⅱ Pause';timer=setInterval(advanceReplay,Number($('speed').value));render();
};
$('step').onclick=()=>{stop();advanceReplay();};
$('reset').onclick=resetReplay;
$('speed').onchange=()=>{if(timer){stop();$('play').click();}};

let syncBusy=false, dataOrigin='Loading';
function showFreshness(){
 const through=data.metadata?.dataset_through||data.checkins.map(c=>c.captured_at.slice(0,10)).sort().at(-1);
 $('freshness').textContent=dataOrigin+' · through '+through+' · version '+(data.metadata?.data_version?.slice(0,10)||data.summary.integration_version);
}
async function refreshData(initial=false,manual=false){
 if(syncBusy)return;syncBusy=true;
 const button=$('refreshData');button.disabled=true;
 try{
  const result=await DataSync.load(fetch.bind(globalThis),initial),incoming=result.payload;
  if(data&&incoming.metadata?.dataset_through<data.metadata?.dataset_through)throw Error('Older dataset rejected');
  const changed=!data||incoming.metadata?.data_version!==data.metadata?.data_version;
  if(timer&&!manual&&changed){$('status').textContent='New GitHub data available. Pause and click Refresh data to load it.';return;}
  const selected=$('user').value,selectedDate=current?.captured_at.slice(0,10);
  if(changed||initial||manual){
   if(data)stop();initialise(incoming);
   if(selected&&incoming.checkins.some(c=>c.patient_id===selected)){$('user').value=selected;chooseUser();const index=rows.findIndex(c=>c.captured_at.slice(0,10)===selectedDate);if(index>=0){day=index;render();}}
  }
  dataOrigin=result.origin;showFreshness();
  $('status').textContent=result.fallbackReason?'GitHub sync unavailable ('+result.fallbackReason+'). Showing the dated bundled snapshot.': 'Synced with GitHub main. Last checked '+new Date().toLocaleTimeString('en-GB')+'.';
 }catch(error){$('status').textContent='GitHub sync failed: '+error.message+'. Current data retained; use Refresh data to retry.';}
 finally{syncBusy=false;button.disabled=false;}
}
$('refreshData').onclick=()=>refreshData(false,true);
refreshData(true);
if(typeof window.addEventListener==='function'){
 setInterval(()=>{if(!document.hidden)refreshData();},300000);
 window.addEventListener('focus',()=>refreshData());
}


