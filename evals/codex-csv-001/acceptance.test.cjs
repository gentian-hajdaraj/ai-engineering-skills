'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');

const corePath=process.env.TARGET_CORE;
if(!corePath) throw new Error('TARGET_CORE must point to a candidate benchmark-core.js');
const absolute=path.resolve(corePath);
if(!fs.existsSync(absolute))throw new Error('Candidate source does not exist: '+absolute);
const {parseCSV,analyze}=require(absolute);
const h='query_id,run_id,surface,surface_present,query_type,mentions,recommendations,citations\n';
const row=s=>h+s+'\n';

test('C01 rejects trailing characters after a closed quoted field',()=>{
 assert.throws(()=>parseCSV(row('a,r,"ChatGPT"EXTRA,1,main,Alpha,Alpha,alpha.example')));
});
test('C02 rejects stray whitespace after a closed quoted field',()=>{
 assert.throws(()=>parseCSV(row('a,r,"ChatGPT" ,1,main,Alpha,Alpha,alpha.example')));
});
test('C03 rejects a quote inside an unquoted field',()=>{
 assert.throws(()=>parseCSV(row('a,r,Chat"GPT,1,main,Alpha,Alpha,alpha.example')));
});
test('C04 rejects an unterminated quoted field',()=>{
 assert.throws(()=>parseCSV(h+'a,r,"ChatGPT,1,main,Alpha,Alpha,alpha.example\n'));
});
test('C05 accepts quoted commas and escaped double quotes',()=>{
 const x=parseCSV(row('a,r,"ChatGPT, ""Agent""",1,main,Alpha,Alpha,alpha.example'));
 assert.equal(x[0].surface,'ChatGPT, "Agent"');
});
test('C06 accepts embedded newline in quoted field and CRLF outside it',()=>{
 const x=parseCSV(h.replaceAll('\n','\r\n')+'a,r,"AI\nMode",1,main,Alpha,Alpha,alpha.example\r\n');
 assert.equal(x[0].surface,'AI\nMode');
});
test('C07 handles UTF-8 BOM and quoted empty entities',()=>{
 const x=parseCSV('\uFEFF'+row('a,r,"AI",1,main,"","",'));
 assert.equal(x.length,1); assert.equal(x[0].mentions.size,0);
});
test('C08 excludes brand-seeded controls from main denominators',()=>{
 const x=parseCSV(h+'a,r,AIO,0,main,,,\n'+'b,r,AIO,1,main,Alpha,Alpha,alpha.example\n'+'ctrl,r,AIO,1,control,Seed,Seed,seed.example\n');
 const s=analyze(x).surfaces[0];
 assert.equal(s.main_observations,2);
 assert.equal(s.main_active,1);
 assert.equal(s.brand_any_all_pct,50);
 assert.equal(s.brand_any_active_pct,100);
 assert.deepEqual(s.top_mentioned_brands.map(i=>i.name),['Alpha']);
});
test('C09 rejects duplicate observation IDs',()=>{
 assert.throws(()=>parseCSV(h+'a,r,AI,1,main,Alpha,Alpha,alpha.example\n'+'a,r,AI,1,main,Beta,Beta,beta.example\n'));
});
test('C10 rejects recommended brands absent from mentions',()=>{
 assert.throws(()=>parseCSV(row('a,r,AI,1,main,Alpha,Beta,alpha.example')));
});
