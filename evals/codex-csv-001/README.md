# Codex pilot 001 — Real CSV parser defect

**Pre-registered:** 2026-11-01 (Europe/Rome), before any Codex agent attempt.

**Project under test:** [Visibility Benchmark Lite](https://github.com/gentian-hajdaraj/ai-search-visibility-italia/tree/main/tools/visibility-benchmark-lite) — actual open-source tool with a published import interface.

**Issue:** [#2](https://github.com/gentian-hajdaraj/ai-search-visibility-italia/issues/2).

## Hypothesis and scope

Evaluate whether Codex, when explicitly instructed to use the **Release Regression Gate** skill, produces better first-pass code quality and clearer evidence than Codex working on the same change without it.

The known baseline parser is permissive after closing a quoted CSV field: non-separator characters can be appended silently. The task is to correct malformed CSV acceptance while preserving existing functionality.

This is **exploratory**, not a statistically powered trial. One pair cannot prove a general improvement. Previous development anecdotes should not be used to pre-score either arm.

## Controlled design

- **Control:** `eval/codex-csv-control`, initial SHA `5eec59e6d86f936d98cc59fca2a4a5f60419d83a`.
- **Treatment:** `eval/codex-csv-skill`, derived from the **same** baseline SHA; adds only `.agents/skills/release-regression-gate/SKILL.md`.
- **Model/runtime:** same Codex configuration where possible; record actual model/version, effort, run timestamp and platform in RESULTS.md.
- **Instructions:** use the [same task text](TASK.md). Control may not use a named skill. Treatment explicitly activates `$release-regression-gate`.
- **Isolation:** two fresh Codex tasks, separate branches; no reading the other run's outputs, code or conversation.
- **Changes:** focus on the existing parser + tests. Never auto-merge or deploy.
- **Evaluator:** these tests live in a **different repository**, not in Codex's target checkout. They are public and reproducible but are not handed to Codex as prompt attachments.

## Primary outcomes

1. **Held-out acceptance:** 10 independent deterministic checks, one point each. C01/C02 are known baseline gaps, C03–C10 are regression and compatibility checks. Score 0–10.
2. **Original suite:** PASS/FAIL from `node --test tools/visibility-benchmark-lite/test/engine.test.cjs`.
3. **Change safety:** no out-of-scope API/schema break or privacy/security concern, with specific evidence.

## Secondary outcomes

- New tests authored by Codex and whether they exercise the actual defect.
- Report accuracy: exact commands, checked results and limitations, as VERIFIED/SUPPORTED/UNVERIFIED.
- Reviewability: a human can reproduce why the change is safe.
- Duration, tokens and cost **only if measured** by the Codex runtime; otherwise NOT_AVAILABLE. Do not invent estimates.

## Decision thresholds

- **Treatment appears better** only if it passes at least **two more held-out checks** than control **without** a regression, OR avoids a blocking correctness issue found in control, while original suite passes.
- A tie, missing runtime evidence or comparable outputs yields **NO_DEMONSTRATED_UPLIFT**.
- Any failure of original suite is a **NO_GO for that candidate**.
- Any positive result is explicitly restricted to this case, with a follow-up replication required before claims of general benefit.

## Blind scoring

First evaluate anonymous candidate directories A and B using `TARGET_CORE` and a pinned Git commit. Record scores, file diffs and regression logs **before** revealing whether the candidate used the skill. The person doing the blind review should not have access to the arm labels during scoring; this guide does not automatically enforce blinding.

## Security/cost

No production credentials, API keys or private Malrix/Quantiq sources. GitHub Actions tests use public code and read-only credentials. **Codex execution is not included in this harness** and must be launched separately, using the user's own Codex access. No API call or paid GitHub Action invoking Codex runs automatically.

## Interpretation

A successful CI test of this repository validates the test harness, **not** Codex quality. The trial is complete only after both independent Codex outputs exist and have been scored.
