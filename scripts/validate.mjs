import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dirs = readdirSync(join(root, 'skills')).filter(name => statSync(join(root, 'skills', name)).isDirectory());
const required = ['evidence-first-pr-review', 'release-regression-gate', 'safe-open-source-extraction', 'verified-agent-handoff'];

function getText(p) { return readFileSync(join(root, p), 'utf8'); }

test('Exactly four named skills are shipped', () => assert.deepEqual(dirs.sort(), required.sort()));

for (const name of required) {
  test('Valid Agent Skill: ' + name, () => {
    const location = 'skills/' + name + '/SKILL.md';
    const md = getText(location);
    const fm = /^---\r?\nname: ([a-z0-9-]+)\r?\ndescription: ([^\r\n]+)\r?\n---\r?\n/.exec(md);
    assert.ok(fm, location + ' must begin with name and description frontmatter');
    assert.equal(fm[1], name);
    assert.ok(fm[2].length >= 60 && fm[2].length <= 1024, 'Description should be useful and concise');
    assert.ok(md.length >= 500, 'Skill must include actual procedures');
    assert.match(md, /^## (Output contract|Required handoff template|Gate semantics|Publication memo)$/m, 'Skill should define inspectable output');
    assert.doesNotMatch(md, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/);
    assert.doesNotMatch(md, /sk-[A-Za-z0-9_-]{24,}/);
    assert.doesNotMatch(md, /ghp_[A-Za-z0-9]{30,}/);
  });
}

test('Docs link all packaged skills and essential files exist', () => {
  const readme = getText('README.md');
  const examples = getText('examples/README.md');
  for (const name of required) {
    assert.ok(readme.includes('skills/' + name + '/SKILL.md'), 'Missing README link for ' + name);
    assert.ok(examples.includes(name), 'Missing example for ' + name);
  }
  for (const file of ['LICENSE','CONTRIBUTING.md','SECURITY.md','CHANGELOG.md','.github/workflows/validate.yml']) {
    assert.ok(existsSync(join(root,file)), 'Missing ' + file);
  }
});
