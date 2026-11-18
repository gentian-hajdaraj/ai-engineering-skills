/**
 * Restore the EXACT npm lockfile tested by Sitevory's public, no-deploy CI.
 * No Cloudflare credentials, secrets or deployment commands are read/executed.
 * Immutable GitHub commit + SHA-256 pin prevent dependency drift.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lockPath = path.join(root, 'package-lock.json');
const localEncoded = path.join(root, 'package-lock.json.gz.b64');
const PINNED_COMMIT = '7c46b3069bfc70aa644c10ffa9839103ce2beb8c';
const PINNED_SHA256 = '73ba0c4749f107f0971d2f0498e2e7c32dc72e713b1c997a11bd9a0140fce901';
const SOURCE_URL = 'https://raw.githubusercontent.com/gentian-hajdaraj/ai-engineering-skills/' + PINNED_COMMIT + '/sitevory-ci/package-lock.json.gz.b64';

function verify(raw) {
  if (raw.length > 1_000_000 || raw.length < 1000) throw new Error('Unexpected lockfile length');
  const digest = createHash('sha256').update(raw).digest('hex');
  if (digest !== PINNED_SHA256) throw new Error('Lockfile digest mismatch: aborting');
  const lock = JSON.parse(raw.toString('utf8'));
  const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
  if (lock.lockfileVersion !== 3 || lock.name !== pkg.name) throw new Error('Invalid lockfile identity');
  for (const [name, version] of Object.entries({...pkg.dependencies,...pkg.devDependencies})) {
    if (lock.packages?.['node_modules/' + name]?.version !== version) {
      throw new Error('Lockfile dependency mismatch: ' + name);
    }
  }
  console.log('PINNED_LOCKFILE_OK sha256=' + digest);
}

async function main() {
  if (existsSync(lockPath)) {
    verify(readFileSync(lockPath));
    return;
  }
  let encoded;
  if (existsSync(localEncoded)) {
    encoded = readFileSync(localEncoded, 'utf8');
  } else {
    const result = await fetch(SOURCE_URL, {signal:AbortSignal.timeout(20_000), redirect:'error'});
    if (!result.ok) throw new Error('Cannot fetch immutable lockfile: HTTP ' + result.status);
    encoded = await result.text();
  }
  encoded = encoded.trim();
  if (!/^[A-Za-z0-9+/=]+$/.test(encoded) || encoded.length > 200_000) throw new Error('Invalid encoded lockfile');
  const raw = gunzipSync(Buffer.from(encoded, 'base64'), {maxOutputLength:1_000_000});
  verify(raw);
  writeFileSync(lockPath, raw, {flag:'wx',mode:0o600});
  console.log('LOCKFILE_RESTORED; no npm install or deploy performed');
}

main().catch(error=>{console.error('LOCKFILE_NO_GO:', error.message);process.exitCode=1;});
