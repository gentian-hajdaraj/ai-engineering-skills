// Apply two upstream TypeScript compatibility fixes to the pinned public source snapshot.
// Fails if the exact reviewed source lines are no longer present; never deploys.
import {readFileSync, writeFileSync} from 'node:fs';
const root = new URL('./', import.meta.url);
function replaceOnce(file, oldText, newText) {
  const url = new URL(file, root);
  const code = readFileSync(url, 'utf8');
  if (code.indexOf(oldText) === -1 || code.indexOf(oldText) !== code.lastIndexOf(oldText)) {
    throw new Error(`Missing/non-unique expected source in ${file}`);
  }
  writeFileSync(url, code.replace(oldText, newText));
}
replaceOnce('src/oauth-foundation.ts',
  'const protectedHandler:ExportedHandler<OAuthEnv,unknown,unknown,SitevoryGrant>=',
  "const protectedHandler:Pick<Required<ExportedHandler<OAuthEnv>>, 'fetch'>=");
replaceOnce('src/oauth-foundation.ts',
  'const props=ctx.props;',
  'const props=ctx.props as SitevoryGrant | undefined;');
replaceOnce('src/oauth-foundation.ts',
  "typeof props.siteId!=='string' || !Array.isArray(props.scopes)",
  "typeof props.siteId!=='string' || typeof props.ownerUserId!=='string' || !Array.isArray(props.scopes)");
replaceOnce('src/wordpress.ts',
  'body: input === undefined ? undefined : JSON.stringify(input),',
  '...(input === undefined ? {} : {body: JSON.stringify(input)}),');
// Sitevory OAuth regression: the Cloudflare provider serializes authorization codes
// as colon-separated components, so a userId containing ':' breaks token exchange.
replaceOnce('src/oauth-foundation.ts',
  'userId:`${grant.siteId}:${grant.ownerUserId}`',
  'userId:`${grant.siteId}_${grant.ownerUserId}`');
// Preserve the WordPress REST payload but do not expose an object with a
// top-level "content" field as a tool result. That field collides with the MCP
// CallToolResult.content transport convention in ChatGPT's plugin adapter.
replaceOnce('src/server.ts',
  "try { return response(await wpRequest(env,path)); } catch { return fail(); }",
  "try { const data = await wpRequest(env,path); return response(documentEnvelope ? {document:data} : data); } catch { return fail(); }");
replaceOnce('src/server.ts',
  "const read = async (path:string):Promise<CallToolResult> => {",
  "const read = async (path:string, documentEnvelope=false):Promise<CallToolResult> => {");
replaceOnce('src/server.ts',
  "}, async ({id}) => read(`/sitevory/v1/content/${id}`));",
  "}, async ({id}) => read(`/sitevory/v1/content/${id}`, true));");
// New isolated-Worker identity gate. Public mirror uses a synthetic example UUID.
replaceOnce('src/env.ts',
  '  SITEVORY_MODE: string;',
  '  SITEVORY_MODE: string;\\n  SITEVORY_WP_EXPECTED_SITE_ID: string;');
const envFile=new URL('src/env.ts',root);
let envCode=readFileSync(envFile,'utf8');
if(envCode.includes('function expectedSiteId'))throw Error('Already pinned');
writeFileSync(envFile,envCode+`
// Immutable, per-Worker WordPress site identity.
export function expectedSiteId(env:Env):string {
  const id=env.SITEVORY_WP_EXPECTED_SITE_ID;
  if(!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(id))throw Error('Invalid expected site ID');
  return id;
}
`);
replaceOnce('src/oauth-foundation.ts',
  "import {wpOrigin} from './env';",
  "import {wpOrigin,expectedSiteId} from './env';");
replaceOnce('src/oauth-foundation.ts',
  'const data=exchange as {site_id:string;user_id:number;scope:string[]};',
  "const data=exchange as {site_id:string;user_id:number;scope:string[]};\\n    if(data.site_id!==expectedSiteId(env))throw Error('Site pin mismatch');");
replaceOnce('src/oauth-foundation.ts',
  "typeof props.siteId!=='string' || typeof props.ownerUserId!=='string'",
  "typeof props.siteId!=='string' || props.siteId!==expectedSiteId(env) || typeof props.ownerUserId!=='string'");
const configUrl=new URL('wrangler.jsonc',root);
const conf=JSON.parse(readFileSync(configUrl,'utf8'));
if(conf.workers_dev!==false||conf.vars?.SITEVORY_WP_ORIGIN!=='https://wp.example.org')throw Error('Unexpected public mirror configuration');
conf.vars.SITEVORY_WP_EXPECTED_SITE_ID='11111111-1111-4111-8111-111111111111';
writeFileSync(configUrl,JSON.stringify(conf,null,2)+'\\n');
console.log('Applied isolated Worker immutable site pin (CI-only, no deploy).');
