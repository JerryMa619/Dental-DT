/* Pure replay state: animates recorded data, does not simulate new measurements. */
(function(root){
 function route(checkin){return checkin.observation.available?[0,1,2,3,4,5,6,7,10,8,11]:[0,1,2,9,6,7,10,8,11];}
 function next(rows,state){
  const r=route(rows[state.day]);
  if(state.phase+1<r.length)return {day:state.day,phase:state.phase+1,done:false};
  if(state.day+1<rows.length)return {day:state.day+1,phase:0,done:false};
  return {...state,done:true};
 }
 const api={route,next};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 else root.FlowPlayback=api;
})(typeof window!=='undefined'?window:globalThis);
