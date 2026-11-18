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
console.log('Applied compatibility, OAuth and read_content tool result envelope fixes.');
