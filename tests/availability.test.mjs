import { readFileSync } from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
function load(file, imports = {}) {
 const code = ts.transpileModule(readFileSync(file, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const module={exports:{}};
 new Function('require','module','exports',code)((name)=>{if(!(name in imports))throw new Error(name);return imports[name]},module,module.exports);
 return module.exports;
}
const rows=new Map();
const db={prepare(sql){return {bind(...args){return {async first(){return rows.get(args[0])??null},async run(){rows.set(args[0],{payload:args[1],fetched_at:args[2]});return {}}}}}}};
const {cached}=load('lib/storage.ts',{'cloudflare:workers':{env:{DB:db}}});
let calls=0;
const limited=()=>{calls++;throw Object.assign(new Error('Provider returned 429'),{status:429,retryAt:new Date(Date.now()+900000).toISOString()})};
await assert.rejects(cached('weather:test',900,limited),{status:429});
await assert.rejects(cached('weather:test',900,limited),{status:429});
assert.equal(calls,1,'Repeated refresh must honor the rate-limit cooldown');
rows.get('failure:weather:test').payload=JSON.stringify({retryAt:'2000-01-01T00:00:00Z'});
assert.deepEqual((await cached('weather:test',900,async()=>({rain:0}))).data,{rain:0});
assert.deepEqual((await cached('weather:test',900,limited)).data,{rain:0},'Use the current success cache without another provider request');
const sample={area:{id:'bhubaneswar'},hazards:[{id:'flood'}],weather:{status:'unavailable'},flood:{status:'ok'}};
const {GET}=load('app/api/monitor/route.ts',{
 '@/lib/locations':{getArea:()=>sample.area},'@/lib/feeds':{monitor:async()=>sample},
 '@/app/chatgpt-auth':{getChatGPTUser:async()=>({userId:'test'})},
 '@/lib/storage':{database:()=>{throw new Error('Test inbox unavailable')}},
 '@/lib/alerts':{evaluateProfile:async()=>{throw new Error('Should not send')}}
});
const oldError=console.error;console.error=()=>{};
const response=await GET(new Request('https://prithvi.test/api/monitor?area=bhubaneswar'));
console.error=oldError;
assert.equal(response.status,200,'An account failure must not discard environmental data');
const body=await response.json();assert.equal(body.flood.status,'ok');assert.match(body.notificationError,/alerts could not be updated/);
const {api}=load('lib/client-api.ts');
globalThis.fetch=async()=>({ok:true,status:200,redirected:false,json:async()=>sample});
assert.deepEqual(await api('/api/monitor'),sample);
globalThis.fetch=async()=>({ok:true,status:200,redirected:false,json:async()=>{throw new SyntaxError('HTML')}});
await assert.rejects(api('/api/monitor'),/unreadable response/);
globalThis.fetch=async()=>({ok:true,status:200,redirected:true});
await assert.rejects(api('/api/monitor'),/sign in again/);
const savedTimeout=globalThis.setTimeout;
globalThis.setTimeout=(fn)=>savedTimeout(fn,5);
globalThis.fetch=(_url,{signal})=>new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError'))));
await assert.rejects(api('/api/monitor'),/request took too long/);
globalThis.setTimeout=savedTimeout;
console.log('Availability checks passed: provider cooldown/recovery, partial data, inbox isolation, invalid responses, session expiry and timeout.');
