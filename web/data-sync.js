/* Public synthetic data only. No token, patient data or authenticated request. */
(function(root){
 const remote='https://raw.githubusercontent.com/JerryMa619/Dental-DT/main/web/data.json';
 function validate(d){
  if(!d||!Array.isArray(d.checkins)||!d.checkins.length||!d.summary||!d.benchmark||!Array.isArray(d.ontology))throw Error('Invalid explorer payload');
  const ids=new Set(),users=new Set();let snapshots=0,advice=0;
  for(const c of d.checkins){
   if(c.synthetic!==true||typeof c.patient_id!=='string'||typeof c.captured_at!=='string'||!Number.isFinite(Date.parse(c.captured_at))||!c.symptom_report||!c.quality_record||!c.observation?.site||!c.assessment||!c.longitudinal_comparison||!Array.isArray(c.adherence_feedback)||!Array.isArray(c.recommendations)||ids.has(c.checkin_id))throw Error('Invalid or duplicate synthetic check-in');
   ids.add(c.checkin_id);users.add(c.patient_id);snapshots+=!!c.snapshot_id;advice+=c.recommendations.length;
  }
  if(d.summary.synthetic!==true||d.summary.checkins!==ids.size||d.summary.users!==users.size||d.summary.snapshots!==snapshots||d.summary.recommendations!==advice)throw Error('Explorer summary mismatch');
  if(d.metadata&&d.metadata.dataset_through!==d.checkins.map(c=>c.captured_at.slice(0,10)).sort().at(-1))throw Error('Dataset date mismatch');
  return d;
 }
 async function read(fetcher,url){
  const options={cache:'no-store',credentials:'omit'};
  if(typeof AbortSignal!=='undefined'&&AbortSignal.timeout)options.signal=AbortSignal.timeout(15000);
  const response=await fetcher(url,options);
  if(!response.ok)throw Error('HTTP '+response.status);
  return validate(await response.json());
 }
 async function load(fetcher,allowFallback=true){
  try{return {payload:await read(fetcher,remote),origin:'GitHub main',fallbackReason:null};}
  catch(error){
   if(!allowFallback)throw error;
   return {payload:await read(fetcher,'data.json'),origin:'Bundled snapshot',fallbackReason:error.message};
  }
 }
 const api={load,validate,remote};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.DataSync=api;
})(typeof window!=='undefined'?window:globalThis);
