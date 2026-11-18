import test from 'node:test';
import assert from 'node:assert/strict';
import {isTicket,isLinkCode,isAllowedScopes,validExchange,isOAuthOrigin} from '../src/pairing.mjs';
test('secure ticket format',()=>{
  assert.equal(isTicket('A'.repeat(43)),true);
  assert.equal(isTicket('../admin'),false);
  assert.equal(isTicket('a'.repeat(200)),false);
});
test('secure authorization code format',()=>{
  assert.equal(isLinkCode('svlink_'+'a'.repeat(43)),true);
  assert.equal(isLinkCode('svlink_'+'$'.repeat(43)),false);
});
test('read-only scope enforced',()=>{
  assert.equal(isAllowedScopes(['site:read']),true);
  assert.equal(isAllowedScopes(['site:read','site:write']),false);
  assert.equal(isAllowedScopes([]),false);
});
test('exchange bound to exact example WordPress origin',()=>{
  const r={success:true,site_id:'01234567-89ab-cdef-0123-456789abcdef',user_id:15,scope:['site:read'],site_url:'https://wp.example.org'};
  assert.equal(validExchange(r,'https://wp.example.org'),true);
  assert.equal(validExchange(r,'https://evil.invalid'),false);
  assert.equal(validExchange({...r,scope:['site:write']},'https://wp.example.org'),false);
  assert.equal(validExchange({...r,user_id:0},'https://wp.example.org'),false);
});
test('OAuth origin validator rejects untrusted schemes and paths',()=>{
  assert.equal(isOAuthOrigin('https://mcp.example.org'),true);
  assert.equal(isOAuthOrigin('http://mcp.example.org'),false);
  assert.equal(isOAuthOrigin('https://mcp.example.org/admin'),false);
});
