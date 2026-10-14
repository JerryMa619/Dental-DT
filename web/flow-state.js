/* Recorded-data replay. Presentation order is not a backend execution log. */
(function(root){
 function emergency(c){return c.symptom_report?.values?.breathing_or_swallowing_difficulty===true||c.priority==='emergency-review';}
 function route(c){
  if(emergency(c))return [0,6,7,10,8,11];
  const r=c.observation.available?[0,1,2,3,4,5,6,7]:[0,1,2,9,6,7];
  if(c.priority==='professional-review')r.push(10);
  return r.concat([8,11]);
 }
 function next(rows,state){
  const r=route(rows[state.day]);
  if(state.phase+1<r.length)return {day:state.day,phase:state.phase+1,done:false};
  if(state.day+1<rows.length)return {day:state.day+1,phase:0,done:false};
  return {...state,done:true};
 }
 const api={route,next,emergency};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FlowPlayback=api;
})(typeof window!=='undefined'?window:globalThis);
