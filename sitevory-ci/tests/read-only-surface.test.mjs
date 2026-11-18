import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const dir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const server=readFileSync(path.join(dir,'src/server.ts'),'utf8');
const upstream=readFileSync(path.join(dir,'src/wordpress.ts'),'utf8');
const auth=readFileSync(path.join(dir,'src/oauth-foundation.ts'),'utf8');
const wrangler=JSON.parse(readFileSync(path.join(dir,'wrangler.jsonc'),'utf8'));
test('exactly four read-only MCP tools exposed',()=>{
  const names=[...server.matchAll(/server\.registerTool\('([^']+)'/g)].map(x=>x[1]);
  assert.deepEqual(names,['site_info','list_content','read_content','read_seo']);
  assert.match(server,/readOnlyHint:true/);
  assert.match(server,/destructiveHint:false/);
  assert.match(server,/const SCOPES = \['site:read'\]/);
});
test('tool layer never handles WordPress credentials or POST writes',()=>{
  assert.doesNotMatch(server,/wpRequest\(env\s*,[^)]*,\s*\{/);
  assert.doesNotMatch(server,/SITEVORY_WP_APP_PASSWORD|SITEVORY_WP_USER/);
  assert.match(upstream,/redirect: 'manual'/);
  assert.match(upstream,/Unsupported WordPress route/);
});
test('authorization endpoint enforces exact incoming origin',()=>{
  assert.match(auth,/assertIncomingOrigin\(req\)/);
  assert.match(auth,/assertIncomingOrigin\(request\)/);
  assert.match(auth,/oauth\/exchange/);
  assert.doesNotMatch(auth,/primeforms-mcp-bridge|PRIMEFORMS_CONNECTOR_TOKEN/);
});
test('worker public mirror only uses example WordPress origin, no secret vars',()=>{
  assert.equal(wrangler.vars?.SITEVORY_WP_ORIGIN,'https://wp.example.org');
  assert.equal(wrangler.vars?.SITEVORY_MODE,'pilot-readonly');
  assert.equal(wrangler.workers_dev,false,'Public mirror must never accept public traffic');
  assert.ok(!Object.hasOwn(wrangler.vars??{},'SITEVORY_WP_APP_PASSWORD'));
  assert.ok(!Object.hasOwn(wrangler.vars??{},'SITEVORY_WP_USER'));
  assert.ok(!Object.hasOwn(wrangler.vars??{},'MCP_BRIDGE_BEARER_TOKEN'));
});
