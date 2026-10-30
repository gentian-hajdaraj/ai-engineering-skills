# Example prompts and expected output shape

These are **illustrative examples**, not the results of a real audit or deployment.

## 1. Evidence-first review

**Prompt:** Use `evidence-first-pr-review` for PR #17. Inspect changes and CI, record what was actually checked, and do not merge.

**Expected format:**

```text
Scope: repo, base/head SHAs, paths checked
Observed evidence: CI run + logs (if inspected)
Findings: severity, path, impact, correction
Unknowns: staging not tested, visuals not inspected, etc.
Decision: READY_FOR_REVIEW | CHANGES_REQUIRED | INSUFFICIENT_EVIDENCE
```

A green build does not automatically mean `READY_FOR_REVIEW`.

## 2. Release regression gate

**Prompt:** Use `release-regression-gate` to assess a proposed PHP release. Production hosting does not run Node.js; verify rollback and existing forms before recommending GO/NO_GO. Do not deploy.

**Expected format:** A matrix with PASS/FAIL/NOT_RUN, pinned candidate SHA, baseline release, rollback readiness, remaining risks, and one decision.

## 3. Open-source extraction

**Prompt:** Use `safe-open-source-extraction` to design a public CSV analyzer derived from a private SaaS. Use only synthetic data and a clean Git history. Do not publish the private repository.

**Expected format:** Included/excluded features, ownership status, validation, public diff inventory, and `PUBLIC_READY`, `NEEDS_REVIEW` or `DO_NOT_PUBLISH`.

## 4. Agent handoff

**Prompt:** Use `verified-agent-handoff` to summarize a multi-week coding task. Check GitHub before reporting completed work, identify current commit, and avoid including secrets.

**Expected format:** Versioned branch, verified head SHA, exact tests run, blockers and one next step with a `READY_TO_HANDOFF`, `HANDOFF_WITH_GAPS` or `BLOCKED` gate.
