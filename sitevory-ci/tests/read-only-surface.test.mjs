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

// Cloudflare Workers OAuth provider code format uses colon-delimited fields.
// A colon inside userId creates four segments and token exchange rejects it
// with invalid_grant / Invalid authorization code format.
test('OAuth principal cannot contain colon delimiter',()=>{
  assert.match(auth,/userId:`\$\{grant\.siteId\}_\$\{grant\.ownerUserId\}`/);
  assert.doesNotMatch(auth,/userId:`\$\{grant\.siteId\}:\$\{grant\.ownerUserId\}`/);
  const siteId='98c74638-b46d-4132-96fc-848523515002';
  const ownerId='4';
  const principal=`${siteId}_${ownerId}`;
  assert.ok(!principal.includes(':'));
  assert.equal(principal.split(':').length,1);
});

test('read_content avoids MCP content-field collision without losing WordPress data',()=>{
  // WordPress returns {id,type,title,content,...}. At top level, "content"
  // can be mistaken for CallToolResult.content by the plugin transport.
  assert.match(server,/const read = async \(path:string, documentEnvelope=false\)/);
  assert.match(server,/return response\(documentEnvelope \? \{document:data\} : data\)/);
  assert.match(server,/read\(`\/sitevory\/v1\/content\/\$\{id\}`, true\)/);
  // Site info, list and SEO must retain their pre-existing response format.
  assert.match(server,/read\('\/sitevory\/v1\/site'\)/);
  assert.match(server,/read\(`\/sitevory\/v1\/content\/\$\{id\}\/seo`\)/);
});
