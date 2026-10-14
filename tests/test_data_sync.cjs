const assert=require('node:assert/strict'),fs=require('node:fs');
const sync=require('../web/data-sync.js');
const data=JSON.parse(fs.readFileSync('web/data.json'));
(async()=>{
 const calls=[];
 let result=await sync.load(async(url,options)=>{calls.push(url);assert.equal(options.credentials,'omit');return {ok:true,json:async()=>data};});
 assert.equal(result.origin,'GitHub main');assert.equal(calls.length,1);
 result=await sync.load(async url=>url.startsWith('https:')?{ok:false,status:404}:{ok:true,json:async()=>data});
 assert.equal(result.origin,'Bundled snapshot');assert.equal(result.fallbackReason,'HTTP 404');
 await assert.rejects(()=>sync.load(async()=>{throw Error('offline');},false),/offline/);
 const broken=structuredClone(data);broken.summary.snapshots++;
 assert.throws(()=>sync.validate(broken),/summary mismatch/);
 const duplicate=structuredClone(data);duplicate.checkins[1]=duplicate.checkins[0];
 assert.throws(()=>sync.validate(duplicate),/duplicate/);
 const real=structuredClone(data);real.checkins[0].synthetic=false;
 assert.throws(()=>sync.validate(real),/synthetic/);
 console.log('PASS: public GitHub loading, explicit dated fallback, offline refresh rejection, summary integrity, duplicate and real-data rejection.');
})().catch(e=>{console.error(e);process.exitCode=1;});
