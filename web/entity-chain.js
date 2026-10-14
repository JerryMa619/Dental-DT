/* Entity-internal presentation of recorded results plus explicitly labelled local mocks. */
(function(root){
 const flow=typeof module!=='undefined'&&module.exports?require('./flow-state.js'):root.FlowPlayback;
 const copy=x=>JSON.parse(JSON.stringify(x));
 function build(c,previous){
  if(c.synthetic!==true)throw Error('Synthetic records required');
  if(previous&&previous.patient_id!==c.patient_id)throw Error('Previous-record patient mismatch');
  const route=flow.route(c),events=[];
  const evidence=c.assessment.evidence_ids,site=c.observation.site;
  const envelope={patient_id:c.patient_id,checkin_id:c.checkin_id,captured_at:c.captured_at,synthetic:true,site};
  function add(stage,owner,title,input,output,ontology,mode='recorded-result',ids=evidence){
   if(!route.includes(stage))return;
   events.push({id:c.checkin_id+':entity-event:'+events.length,stage,owner,title,mode,input:copy(input),output:copy(output),ontology,evidence_ids:copy(ids)});
  }
  add(0,'UE','Create daily check-in input',envelope,{...envelope,symptom_report:c.symptom_report,prior_feedback:c.adherence_feedback},['Patient','SymptomReport','FollowUpRecord']);
  add(0,'CSE','Check fictional identity binding',envelope,{same_patient:!previous||previous.patient_id===c.patient_id,synthetic_identity_only:true,real_authentication:'not-implemented'},['Patient','ScanSession'],'local-simulation');
  add(0,'DTE','Check symptoms first',c.symptom_report,{emergency:flow.emergency(c),scan_required_before_emergency_advice:false,ordering:'local presentation; backend is not interrupted by this demo'},['SymptomReport','ClinicalAssessment'],'local-simulation');
  add(1,'DCDCE','Create acquisition session',envelope,{session_id:c.session_id,site,image_available:false,geometry_available:false,source:'synthetic structured inputs'},['ScanSession','ToothSurface']);
  add(2,'CSE','Check exchange contract',{...envelope,quality:c.quality_record,observation:c.observation},{quality_observation_consistent:(c.quality_record.status==='accepted')===c.observation.available,finite_signals:c.observation.available?Object.values(c.observation.values).every(x=>typeof x==='number'&&Number.isFinite(x)):null,live_validation:false},['QualityAssessment','Observation'],'local-simulation');
  add(2,'DCDCE','Read recorded quality result',c.quality_record,{quality:c.quality_record.status,observation_usable:c.observation.available,quality_source:'supplied synthetic status; no image quality algorithm'},['QualityAssessment']);
  add(2,'CSE','Apply simulated quality branch',c.quality_record,{route:c.observation.available?'accepted observation → DTE':'no new snapshot; symptoms remain available',snapshot_update_permitted:c.observation.available},['QualityAssessment'],'local-simulation');
  add(3,'CSE','Map semantic objects',{site,session_id:c.session_id},{mapping:{patient:'Patient',session:'ScanSession',site:'ToothSurface',observation:'Observation',quality:'QualityAssessment'},rdf_instance_export:false,owl_inference:false},['Patient','ScanSession','ToothSurface','Observation'],'local-simulation');
  add(3,'DTE','Receive accepted observation',c.observation,{observation_id:c.observation.id,site,values:c.observation.values,origin:c.observation.origin},['Observation','ToothSurface']);
  add(4,'CSE','Link provenance and version references',{session_id:c.session_id,observation_id:c.observation.id},{source_checkin:c.checkin_id,captured_at:c.captured_at,previous_snapshot_id:c.previous_snapshot_id,clinical_model_version:null,advice_protocol_version_in_export:null},['Observation','TwinSnapshot'],'local-simulation');
  add(4,'DTE','Replay DT snapshot update',{previous_snapshot_id:c.previous_snapshot_id,observation_id:c.observation.id},{snapshot_id:c.snapshot_id,scope:'recorded target surface only',storage:'precomputed dataset; no new persistent write',new_geometry:false},['TwinSnapshot']);
  add(5,'DTE','Look up previous check',{previous_checkin_id:c.previous_checkin_id},{previous_checkin_id:previous?.checkin_id||null,same_site:previous?JSON.stringify(previous.observation.site)===JSON.stringify(site):null,last_valid_baseline_search:false},['TwinSnapshot','FollowUpRecord'],'local-simulation');
  add(5,'DTE','Replay longitudinal comparison',{current_checkin_id:c.checkin_id,previous_checkin_id:c.previous_checkin_id},c.longitudinal_comparison,['FollowUpRecord']);
  add(6,'CSE','Collect assessment evidence',{symptom_id:c.symptom_report.id,quality_id:c.quality_record.id,observation_available:c.observation.available},{evidence_ids:evidence,signal_source:'synthetic',image_evidence:false},['SymptomReport','QualityAssessment','Observation'],'local-simulation');
  add(6,'DTE','Replay rule assessment',{symptoms:c.symptom_report,quality:c.quality_record,observation:c.observation.available?c.observation:null},{assessment:c.assessment,priority:c.priority,history_used_by_rules:false,adherence_used_by_rules:false,diagnosis:'not-performed'},['ClinicalAssessment']);
  add(7,'DTE','Assemble advice and rule sources',c.assessment,{recommendations:c.recommendations,rule_ids:c.recommendations.map(a=>a.rule_id)},['Recommendation','AdviceProtocol']);
  add(7,'CSE','Check advice traceability',{recommendations:c.recommendations,evidence_ids:evidence},{all_advice_linked:c.recommendations.every(a=>a.assessment_id===c.assessment.id&&a.evidence_ids.every(id=>evidence.includes(id))),ontology_constraints:'not executed; local JSON reference check only'},['Recommendation','ClinicalAssessment'],'local-simulation');
  add(7,'UE','Display assessment and actions',{priority:c.priority,recommendations:c.recommendations},{patient_id:c.patient_id,site,priority:c.priority,actions:c.recommendations.map(a=>({text:a.text,rule_id:a.rule_id,source:a.source})),finding_source:'simulated',not_health_clearance:true},['Recommendation']);
  add(9,'DTE','Retain prior DT state',c.quality_record,{new_snapshot:null,retained_snapshot_id:c.previous_snapshot_id,symptoms_not_discarded:true},['TwinSnapshot','QualityAssessment']);
  add(9,'UE','Display targeted rescan request',{quality:c.quality_record.status,site},{action:'repeat-scan',site,no_same_day_replacement_record:true},['Recommendation']);
  add(9,'DCDCE','Await rescan data',{session_id:c.session_id,site},{replacement_session:null,status:'not present in dataset',retry_timeout_handling:'not-implemented'},['ScanSession'],'planned-not-connected');
  add(10,'CSE','Check professional collaboration boundary',{patient_id:c.patient_id,priority:c.priority},{dentist_binding:'not-implemented',consent:'not-captured',delivery_allowed:false,no_external_message:true},['NotificationEvent'],'planned-not-connected');
  add(10,'UE','Display professional review advice',{priority:c.priority,recommendations:c.recommendations},{notification:c.notification,delivery_receipt:null,clinician_response:null,emergency_action_must_not_wait:flow.emergency(c)},['Recommendation','NotificationEvent']);
  add(8,'UE','Return advice feedback',{previous_checkin_id:c.previous_checkin_id},{adherence_status:c.adherence_status,feedback:c.adherence_feedback,unreported_is_not_nonadherence:true},['FollowUpRecord'],c.feedback_simulation?'local-simulation':'recorded-result');
  add(8,'CSE','Check feedback references',{feedback:c.adherence_feedback,previous_recommendations:previous?.recommendations.map(a=>a.recommendation_id)||[]},{feedback_count:c.adherence_feedback.length,all_links_match_prior_check:c.adherence_feedback.every(f=>previous?.recommendations.some(a=>a.recommendation_id===f.recommendation_id)),reported_execution_is_not_verified:true},['FollowUpRecord','Recommendation'],'local-simulation');
  add(8,'DTE','Record feedback and pending limits',{feedback:c.adherence_feedback,longitudinal_comparison:c.longitudinal_comparison},{adherence_status:c.adherence_status,feedback_persisted_in_source_record:!c.feedback_simulation,temporary_browser_scenario:!!c.feedback_simulation,advice_recalculated_from_feedback:false,clinical_recovery_claim:false},['FollowUpRecord'],c.feedback_simulation?'local-simulation':'recorded-result');
  add(11,'DTE','Close check-in record',{checkin_id:c.checkin_id},{checkin_id:c.checkin_id,current_snapshot_id:c.snapshot_id||c.previous_snapshot_id,linked_assessment:c.assessment.id,linked_advice:c.recommendations.map(a=>a.recommendation_id)},['TwinSnapshot','ClinicalAssessment','Recommendation']);
  add(11,'UE','Prepare the next check',{patient_id:c.patient_id},{next_check:'next recorded day',reminder_service_connected:false,follow_up_outcome:'not inferred'},['FollowUpRecord'],'local-simulation');
  // Preserve the selected branch order, including rescan and emergency shortcuts.
  events.sort((a,b)=>route.indexOf(a.stage)-route.indexOf(b.stage));
  events.forEach((e,i)=>{e.input_event_id=i?events[i-1].id:null;e.ordinal=i+1;});
  return events;
 }
 const api={build};
 if(typeof module!=='undefined'&&module.exports){module.exports=api;return;}
 const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let events=[],current=[],index=-1,playing=false,start=0,ms=3500,lastTime=0,lastRow=null,lastPrevious=null,feedbackOverride=null;
 const owners=['UE','DCDCE','DTE','CSE'],xy={UE:[135,67],DCDCE:[425,67],DTE:[715,67],CSE:[425,193]};
 function draw(i){
  if(!current.length)return;index=i;const e=current[i],previous=i?current[i-1]:events[events.indexOf(e)-1];
  let svg='<svg viewBox="0 0 850 270" role="img" aria-label="UE DCDCE DTE and cross-system data exchanges"><defs><marker id="entityArrow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#6da6c1"/></marker></defs>';
  for(const who of owners.slice(0,3)){const [x,y]=xy[who];svg+=`<path d="M${x},${y+32} L425,160" stroke="#31546d" stroke-dasharray="4 5" fill="none"/>`;}
  const from=previous?.owner||e.owner,A=xy[from],B=xy[e.owner],path=from===e.owner?`M${B[0]-22},${B[1]} C${B[0]-45},${B[1]-50} ${B[0]+45},${B[1]-50} ${B[0]+22},${B[1]}`:`M${A[0]},${A[1]} L${B[0]},${B[1]}`;
  svg+=`<path d="${path}" stroke="#7de6ee" stroke-width="2" fill="none" marker-end="url(#entityArrow)"/>`;
  for(const who of owners){const [x,y]=xy[who],on=e.owner===who,w=who==='CSE'?600:240;svg+=`<g><rect x="${x-w/2}" y="${y-30}" width="${w}" height="60" rx="10" fill="${on?'#17495c':'#11273b'}" stroke="${on?'#7de6ee':'#35546d'}" stroke-width="${on?2:1}"/><text x="${x}" y="${y-4}" text-anchor="middle" fill="#e4f5ff" font-size="16" font-weight="600">${who}</text><text x="${x}" y="${y+16}" text-anchor="middle" fill="#a7c8dc" font-size="10">${{UE:'Input · advice · feedback',DCDCE:'Acquisition · quality',DTE:'Observe · store · compare · assess',CSE:'Shared services: identity · format · semantics · provenance · permissions'}[who]}</text></g>`;}
  if(playing)svg+=`<circle r="5" fill="#f1c47a" stroke="#fff" stroke-width="1"><animateMotion dur="${Math.max(250,ms/current.length*.65)}ms" fill="freeze" path="${path}"/></circle>`;
  svg+='</svg>';document.getElementById('entityCanvas').innerHTML=svg;
  document.getElementById('entityOwner').textContent=e.owner+' · '+({'recorded-result':'Recorded result','local-simulation':'Local simulation','planned-not-connected':'Unconnected interface'}[e.mode]);
  document.getElementById('entityOperation').textContent=e.title;
  document.getElementById('entityCounter').textContent='Stage operation '+(i+1)+' / '+current.length+' · check event '+e.ordinal+' / '+events.length;
  document.getElementById('entityInput').textContent=JSON.stringify({input_event_id:e.input_event_id,payload:e.input},null,2);
  document.getElementById('entityOutput').textContent=JSON.stringify({event_id:e.id,mode:e.mode,payload:e.output,ontology:e.ontology,evidence_ids:e.evidence_ids},null,2);
  document.getElementById('entitySteps').innerHTML=current.map((a,k)=>`<button type="button" data-entity-index="${k}" class="${k===i?'active':''}"><small>${a.owner}</small>${escape(a.title)}</button>`).join('');
  document.getElementById('entitySteps').querySelectorAll('button').forEach(b=>b.onclick=()=>{root.stop();playing=false;draw(Number(b.dataset.entityIndex));});
 }
 function update(c,p,stage,isPlaying,speed){lastRow=c;lastPrevious=p;if(feedbackOverride?.checkin_id!==c.checkin_id)feedbackOverride=null;events=build(feedbackOverride||c,p);current=events.filter(e=>e.stage===stage);playing=isPlaying;start=0;lastTime=0;ms=speed;index=-1;draw(0);document.getElementById('entityDemoFeedback').disabled=!p?.recommendations?.length;document.getElementById('entityScenarioNote').textContent=feedbackOverride?'Temporary feedback scenario: display only; no source record or backend write.':'Using recorded synthetic data. Missing feedback remains unreported.';}
 function pause(){playing=false;if(index>=0)draw(index);}
 function frame(time){if(playing&&current.length){if(!start)start=time;const p=Math.min((time-start)/ms,.999);const i=Math.floor(p*current.length);if(i!==index)draw(i);}lastTime=time;requestAnimationFrame(frame);}
 requestAnimationFrame(frame);
 document.getElementById('entityDemoFeedback').onclick=()=>{
   if(!lastPrevious?.recommendations?.length)return;
   root.selectStage(8);
   feedbackOverride=copy(lastRow);feedbackOverride.feedback_simulation=true;
   feedbackOverride.adherence_status='reported';
   feedbackOverride.adherence_feedback=[{recommendation_id:lastPrevious.recommendations[0].recommendation_id,status:'reported-completed',reported_at:lastRow.captured_at,origin:'synthetic-user-report; temporary browser scenario',verified_execution:false}];
   update(lastRow,lastPrevious,8,false,ms);
 };
 document.getElementById('entityClearFeedback').onclick=()=>{feedbackOverride=null;root.render();};
 root.EntityChain={build,update,pause};
})(typeof window!=='undefined'?window:globalThis);
