'use strict';
// Illustrative anatomy and scanning motion; no image/mesh is inferred from the dataset.
const ScanScene=(()=>{
 let tick=0, elapsed=0, last=0, playing=false, currentStage=0, row=null, duration=1800, snapshotApplied=false,acquisitionSeen=false;
 const captions=['Prepare a home check','Capture the target surface','Check data quality','Link site and observations','Update the personal twin','Compare historical state','Assess observations and symptoms','Create evidence-linked advice','Record feedback and follow-up','Insufficient quality · rescan','Professional review interface','Move to the next daily check'];
 function teeth(twin,p){
  let out='';
  for(let arch=0;arch<2;arch++)for(let i=0;i<14;i++){
   const angle=Math.PI*(.10+.80*i/13),x=160+124*Math.cos(angle),y=arch===0?65+90*Math.sin(angle):300-90*Math.sin(angle);
   const tooth=(arch===0?(i<7?'1':'2'):(i<7?'4':'3'))+String(i<7?7-i:i-6);
   const lit=tooth===String(row.observation.site.tooth_code)&&p>0;
   out+=`<g transform="translate(${x},${y}) rotate(${(arch===0?1:-1)*(i-6.5)*8})"><path d="M-12,-17 Q-17,-10 -13,5 L-10,17 Q0,22 10,17 L13,5 Q17,-10 12,-17 Q0,-23 -12,-17Z" fill="${twin?'#123a45':lit?'#a8f4de':'#f6eedd'}" stroke="${twin?lit?'#66e8d6':'#31515f':'#b7a998'}" stroke-width="1.5"/>${twin&&lit?'<path d="M-10,-12 L9,10 M10,-12 L-9,10 M-12,0 L12,0" stroke="#65dace" stroke-width=".6"/>':''}</g>`;
  }
  return out;
 }
 function render(p){
  const el=document.getElementById('scanScene');if(!el||!row)return;
  const accepted=row.observation.available,scanning=currentStage===1;
  const coverage=!acquisitionSeen?0:scanning?p:1;
  const twinVisible=accepted&&snapshotApplied;
  const code=String(row.observation.site.tooth_code),quadrant=Number(code[0]),number=Number(code[1]),index=[1,4].includes(quadrant)?7-number:6+number;
  const angle=Math.PI*(.10+.80*Math.max(0,Math.min(index,13))/13),sx=160+124*Math.cos(angle)+(p-.5)*12,sy=([1,2].includes(quadrant)?65+90*Math.sin(angle):300-90*Math.sin(angle));
  const labels=['Scan & acquisition','Quality gate','DDT state','Compare & assess','Advice & feedback'];
  const active=currentStage<=1?0:currentStage===2||currentStage===9?1:currentStage<=4?2:currentStage<=6?3:4;
  let packets='';if(currentStage>1&&playing)for(let i=0;i<5;i++){const x=345+((p+i/5)%1)*190;packets+=`<circle cx="${x}" cy="178" r="${i===0?5:3}" fill="#efc070"/>`;}
  let svg=`<svg viewBox="0 0 1000 440" role="img" aria-label="Illustrative dental scan and digital twin animation"><defs><radialGradient id="scanGlow"><stop stop-color="#75ffdd" stop-opacity=".55"/><stop offset="1" stop-color="#75ffdd" stop-opacity="0"/></radialGradient><linearGradient id="gum"><stop stop-color="#b5717d"/><stop offset="1" stop-color="#724758"/></linearGradient></defs><text x="32" y="31" fill="#87aeb7" font-size="11" letter-spacing="2">01 / PHYSICAL MOUTH</text><text x="548" y="31" fill="#87aeb7" font-size="11" letter-spacing="2">02 / DENTAL DIGITAL TWIN</text><g transform="translate(18,24)"><path d="M24,166 C17,13 304,13 297,166 L279,167 C286,54 36,54 43,167Z" fill="url(#gum)"/><path d="M24,199 C17,352 304,352 297,199 L279,198 C286,310 36,310 43,198Z" fill="url(#gum)"/>${teeth(false,coverage)}${scanning?`<circle cx="${sx}" cy="${sy}" r="45" fill="url(#scanGlow)"/><g transform="translate(${sx},${sy-43}) rotate(-25)"><path d="M-10,0 L-10,-56 Q-10,-68 3,-68 L18,-68 Q28,-68 28,-56 L28,0Z" fill="#beced4" stroke="#e7f3f5"/><rect x="-14" y="-2" width="46" height="19" rx="7" fill="#f5fbfa"/><path d="M-8,20 L0,43 L24,43 L28,20" fill="#7fffd8" opacity=".4"/></g>`:''}<text x="160" y="359" text-anchor="middle" fill="#c4d6dc" font-size="12">Target tooth ${escape(row.observation.site.tooth_code)} · illustrative anatomy</text></g><path d="M345,178 H535" stroke="#41616d" stroke-width="2" stroke-dasharray="5 6"/>${packets}<text x="437" y="154" text-anchor="middle" fill="#e4bc77" font-size="12">${row.priority==='emergency-review'?'Symptoms first':currentStage===9?'Rescan branch':currentStage>=2?'Data enters DDT':'Awaiting capture'}</text><g transform="translate(543,24)">${teeth(true,twinVisible?1:0)}<text x="160" y="359" text-anchor="middle" fill="#74d7c9" font-size="12">${twinVisible?'Record linked to a DT snapshot':accepted?'Awaiting quality gate and update':'No new snapshot for this check'}</text></g><g transform="translate(860,62)"><text fill="#8fa8b2" font-size="11">RECORD</text><text y="24" fill="#fff" font-size="12">${escape(row.patient_id)}</text><text y="46" fill="#8fa8b2" font-size="10">${escape(row.captured_at.slice(0,10))}</text><text y="88" fill="#8fa8b2" font-size="11">TOOTH / SURFACE</text><text y="112" fill="#74d7c9" font-size="12">${escape(row.observation.site.tooth_code)}</text><text y="132" fill="#8fa8b2" font-size="10">${escape(row.observation.site.surface)}</text><text y="177" fill="#8fa8b2" font-size="11">QUALITY</text><text y="201" fill="${accepted?'#74d7c9':'#e4bc77'}" font-size="11">${escape(row.quality_record.status)}</text></g></svg>`;
  el.innerHTML=svg;
  document.getElementById('sceneCaption').textContent=captions[currentStage];
  document.getElementById('sceneRail').innerHTML=labels.map((x,i)=>`<span class="${i===active?'active':''}">${i+1}. ${x}</span>`).join('');
  const details=currentStage===1?'Only the target surface has a record; other teeth provide context. Scanning motion is illustrative and does not represent measured coverage, images or 3D reconstruction.':currentStage===9?'Quality rejected: retain prior state and request a rescan. Symptoms remain available for assessment.':currentStage===4?'Snapshot: '+(row.snapshot_id||'no new snapshot'):currentStage===5?'History comparison: '+(row.longitudinal_comparison?.status||'not comparable'):currentStage===7?'This check contains '+row.recommendations.length+' synthetic recommendations. Inspect their evidence and rules below.':currentStage===8?'Advice feedback: '+(row.adherence_status||'not-reported'):currentStage===10?'The dentist notification interface is not connected. No message is sent.':'The selected synthetic record drives the flow. Data packets and ontology mappings appear below.';
  document.getElementById('sceneDetail').textContent=details;
 }
 function escape(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
 function update(r,s,isPlaying,ms,applied=false,acquired=false){row=r;snapshotApplied=applied;acquisitionSeen=acquired;currentStage=s;playing=isPlaying;duration=ms;elapsed=0;last=0;render(s===1&&!isPlaying?.45:0);}
 function pause(){playing=false;}
 function frame(time){if(playing&&row){if(last)elapsed+=time-last;render(Math.min(elapsed/duration,1));}last=time;tick=requestAnimationFrame(frame);}
 if(typeof requestAnimationFrame==='function')tick=requestAnimationFrame(frame);
 return {update,pause};
})();
