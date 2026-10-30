# Evidence-First AI Engineering Skills

**Practical Agent Skills for safer AI-assisted software development.**

Four original, reusable workflows for coding agents: review claims against evidence, prevent regressions, publish safe open-source tools and hand off complex projects without losing context. Each skill is a self-contained `SKILL.md` instruction file, following the open Agent Skills convention.

> **Principle:** An AI-generated claim is not a verified result. If evidence is missing, explicitly say what remains unknown.

## Skills

| Skill | What it helps with | Link |
|---|---|---|
| Evidence-first PR Review | Trace claims to code/test evidence; flag unverified assumptions and defects | [Read skill](skills/evidence-first-pr-review/SKILL.md) |
| Release Regression Gate | Check readiness before staging/production release, including rollback | [Read skill](skills/release-regression-gate/SKILL.md) |
| Safe Open Source Extraction | Publish independent tooling without leaking proprietary code or data | [Read skill](skills/safe-open-source-extraction/SKILL.md) |
| Verified Agent Handoff | Preserve decisions and actual work across agents, chats and branches | [Read skill](skills/verified-agent-handoff/SKILL.md) |

## Quick start

1. Choose a skill that matches the task.
2. Copy its directory from `skills/` into the `.agents/skills/` directory of the repository in which your coding agent works (for compatible Codex/agent setups).
3. Preserve the `SKILL.md` name and YAML frontmatter.
4. Ask the agent to use the skill by name. Its instructions guide the review or planning process; they **do not** grant new permissions or authorize deployment.

Example (after installing a skill in your coding environment):

> Use the `evidence-first-pr-review` skill to inspect this pull request. Pin the current head commit, show primary evidence, run available tests, and abstain from unsupported claims. Don't merge.

For outputs and review gates, see [examples](examples/README.md). Exact skill installation mechanics can vary by agent and release.

## What this is and is not

- ✅ Plain-text, inspectable workflows. No dependencies, account access, cloud service or hidden scripts needed to *read* or *use* the instructions.
- ✅ Works across languages and stacks, including JavaScript, TypeScript, PHP, Laravel and WordPress.
- ✅ Encourages precise distinctions between **verified**, **supported**, **unverified** and **contradicted**.
- ❌ Not an automated security audit, formal proof, CI replacement, or guarantee that the code is secure.
- ❌ Not a reproduction of any private AI application, customer codebase or proprietary research pipeline.

## Repository structure

```text
skills/
  evidence-first-pr-review/SKILL.md
  release-regression-gate/SKILL.md
  safe-open-source-extraction/SKILL.md
  verified-agent-handoff/SKILL.md
scripts/validate.mjs
examples/README.md
.github/workflows/validate.yml
README.md  LICENSE  CONTRIBUTING.md  SECURITY.md  CHANGELOG.md
```

## Validate the release

With Node.js 20+ available locally or in GitHub Actions:

```bash
node --test scripts/validate.mjs
```

You don't need Node.js on your production hosting environment; CI can run the tests for this source-only repository.

## Versioning

The **v0.1.0** initial public edition includes four skills and a structural validation suite. Skill instructions may evolve; document changes in [CHANGELOG.md](CHANGELOG.md). Tags/releases, if any, are announced in [GitHub Releases](https://github.com/gentian-hajdaraj/ai-engineering-skills/releases).

## Author and related research

Created by [Gentian Hajdaraj](https://github.com/gentian-hajdaraj). See also [AI Search Visibility in Italia — 2026](https://github.com/gentian-hajdaraj/ai-search-visibility-italia), a separate DOI-backed public research project. The research does not validate or endorse these skill instructions.

## License

MIT. See [LICENSE](LICENSE). This license applies to **this standalone repository**, not to separately licensed data or code in other projects.
