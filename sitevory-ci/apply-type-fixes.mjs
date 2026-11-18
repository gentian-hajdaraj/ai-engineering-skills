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
  'const protectedHandler:ExportedHandler<OAuthEnv>=');
replaceOnce('src/oauth-foundation.ts',
  'const props=ctx.props;',
  'const props=ctx.props as SitevoryGrant | undefined;');
replaceOnce('src/oauth-foundation.ts',
  "typeof props.siteId!=='string' || !Array.isArray(props.scopes)",
  "typeof props.siteId!=='string' || typeof props.ownerUserId!=='string' || !Array.isArray(props.scopes)");
replaceOnce('src/wordpress.ts',
  'body: input === undefined ? undefined : JSON.stringify(input),',
  '...(input === undefined ? {} : {body: JSON.stringify(input)}),');
console.log('Applied 2 TypeScript compatibility fixes to verified source snapshot.');
