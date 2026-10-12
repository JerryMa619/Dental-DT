'use strict';
let data, rows=[], current, day=0, stage=0, timer=null;
const $=id=>document.getElementById(id);
const names=['Home check-in','Acquisition','Quality gate','Observation','Twin snapshot','Comparison','Assessment','Advice','Follow-up'];
const entities=['UE + clinical extension','DCDCE','DCDCE / CSE','SOSA / DCDCE','CE','CE','CE','CE → UE','UE → CE'];
const descriptions=[
'Patient, time and symptoms are linked to the daily session. All identities are fictional.',
'Only synthetic structured signals exist. Physical scanner, RGB and geometry are not implemented.',
'Quality is supplied by the generator. Rejected data create no new snapshot.',
'Accepted procedural scores carry anatomical site and evidence identity; not measured clinical properties.',
'Accepted observations update a versioned patient state. Rejected checks retain the previous snapshot reference.',
'Compare same-site signals with the prior actual check. Missing data is not improvement.',
'Draft rule evaluation uses symptoms and simulated observable scores, never clinical ground truth.',
'Recommendations carry rule IDs, source links and evidence references. No actual messages are sent.',
'Execution feedback is user-reported when supplied. Current daily data contain no adherence reports.'
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
function chooseUser(){stop();rows=data.checkins.filter(r=>r.patient_id===$('user').value).sort((a,b)=>a.captured_at.localeCompare(b.captured_at));day=0;$('day').max=rows.length-1;render();}
function render(){
 current=rows[day];$('day').value=day;$('dateLabel').textContent=current.captured_at.slice(0,10);
 $('recordBadge').innerHTML='<span class="tag '+(current.observation.available?'':'warn')+'">'+(current.observation.available?'Accepted observation':'Rejected acquisition')+'</span>';
 $('flowNodes').innerHTML=names.map((n,i)=>'<button class="node '+(i===stage?'selected':'')+'" data-stage="'+i+'"><span class="num">0'+(i+1)+' / '+entities[i]+'</span><span class="arrow">↘</span><b>'+n+'</b><small>'+nodeValue(i)+'</small></button>').join('');
 $('flowNodes').querySelectorAll('button').forEach(b=>b.onclick=()=>{stage=Number(b.dataset.stage);render();});
 inspect();chart();
 const c=current.longitudinal_comparison||{status:'not-computed'};
 $('comparison').innerHTML='<span class="tag">'+esc(c.status)+'</span><p class="sub">Compared with '+esc(c.previous_checkin_id||'no prior baseline')+'. Changes have no established clinical meaning.</p>'+Object.entries(c.metrics||{}).map(([k,v])=>'<div class="sub">'+esc(k)+' · '+esc(v.direction)+' · Δ '+esc(v.delta)+'</div>').join('');
 $('feedback').innerHTML='<span class="tag">'+esc(current.adherence_status||'not-reported')+'</span><p class="sub">No feedback is inferred from a lower signal. Reports do not prove execution or a causal effect.</p>';
 ontologySelect('Patient');
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
function inspect(){$('detailTitle').textContent=names[stage];$('detailDescription').textContent=descriptions[stage];$('detailJson').textContent=pretty(stageData(stage));}
function chart(){
 const W=560,H=190,p=28,n=rows.length,x=i=>p+i*(W-2*p)/Math.max(n-1,1),y=v=>H-p-v*(H-2*p);
 let svg='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Seven-day synthetic deposit and redness score history">';
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
 const edges=[[0,1,'forPatient'],[1,4,'inSession'],[0,2,'reportedByPatient'],[3,4,'featureOfInterest'],[4,5,'quality context'],[4,6,'derivedFrom'],[6,7,'assessesSnapshot'],[4,7,'hasEvidence'],[7,8,'basedOnAssessment'],[9,7,'version context'],[10,8,'usesAdviceProtocol'],[8,11,'follow-up context']];
 let s='<svg viewBox="0 0 560 435" role="img" aria-label="Ontology relationship graph">';
 edges.forEach(([a,b,t])=>{const A=graphNodes[a],B=graphNodes[b];s+='<line x1="'+A[1]+'" y1="'+A[2]+'" x2="'+B[1]+'" y2="'+B[2]+'" stroke="#c7d7c1" stroke-width="1.5"/><text x="'+((A[1]+B[1])/2)+'" y="'+((A[2]+B[2])/2-7)+'" text-anchor="middle" font-size="7" fill="#6b8172">'+t+'</text>';});
 graphNodes.forEach(([name,x,y])=>s+='<g class="concept" data-concept="'+name+'" tabindex="0" role="button" aria-label="'+name+'"><rect x="'+(x- seventy())+'" y="'+(y-20)+'" width="140" height="40" rx="8" fill="#edf4e7" stroke="#abc6a1"/><text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" font-size="10" fill="#18332e">'+name+'</text></g>');
 $('ontologyGraph').innerHTML=s+'</svg>';
 $('ontologyGraph').querySelectorAll('[data-concept]').forEach(n=>{n.onclick=()=>ontologySelect(n.dataset.concept);n.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();ontologySelect(n.dataset.concept);}};});
}
function seventy(){return 70;}
function ontologySelect(name){const n=graphNodes.find(x=>x[0]===name);if(!n)return;$('ontologyTitle').textContent=name;$('ontologyDescription').textContent=n[3];
 const mapping={Patient:{id:current.patient_id},ScanSession:stageData(0),SymptomReport:current.symptom_report,ToothSurface:current.observation.site,Observation:current.observation,QualityAssessment:current.quality_record,TwinSnapshot:stageData(4),ClinicalAssessment:current.assessment,Recommendation:current.recommendations,ModelVersion:{integration_version:data.summary.integration_version,clinical_model:false},AdviceProtocol:{rules:current.recommendations.map(r=>({rule_id:r.rule_id,source:r.source}))},FollowUpRecord:stageData(8)};
 $('ontologyJson').textContent=pretty(mapping[name]);}
function stop(){if(timer)clearInterval(timer);timer=null;$('play').textContent='▶ Replay days';}
$('user').onchange=chooseUser;
$('day').oninput=()=>{stop();day=Number($('day').value);render();};
$('play').onclick=()=>{if(timer){stop();return;}if(day===rows.length-1)day=-1;$('play').textContent='Ⅱ Pause';timer=setInterval(()=>{day++;render();if(day>=rows.length-1)stop();},1200);};
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('nav button').forEach(n=>n.classList.toggle('active',n===b));document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===b.dataset.tab));});
$('download').onclick=()=>{const url=URL.createObjectURL(new Blob([pretty(current)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=current.patient_id+'-'+current.captured_at.slice(0,10)+'.json';a.click();URL.revokeObjectURL(url);};
$('importData').onchange=async e=>{try{stop();initialise(JSON.parse(await e.target.files[0].text()));$('status').textContent='Loaded local synthetic explorer data. No data uploaded.';}catch(err){$('status').textContent='Could not load data: '+err.message;}};
fetch('data.json').then(r=>{if(!r.ok)throw Error('Dataset unavailable');return r.json();}).then(initialise).catch(e=>$('status').textContent='Loading failed: '+e.message);
