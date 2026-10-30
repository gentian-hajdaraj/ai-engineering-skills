---
name: evidence-first-pr-review
description: Review a pull request or code change using reproducible evidence, separating observed facts, untested assumptions, security risks, and explicit unknowns. Use before merging complex, security-sensitive, or AI-generated code.
---

# Evidence-first PR review

Goal: decide whether the specified change is supported by enough **observable evidence** to merge. Never confuse passing tests with proof of safety or completeness.

## Procedure

1. **Fix the scope.** Record repository, base/head commit SHAs, changed paths, intended behavior, and the user-approved review target. Do not silently widen the diff.
2. **Collect primary evidence.** Read the actual changed files, relevant tests, runtime contracts, CI run logs, and nearby integration points. Describe anything inaccessible as *not inspected*. Treat PR descriptions and code comments as claims, not proof.
3. **Build a claim-evidence matrix.** For each important behavior, record: claimed result, relevant code location, direct evidence, attempted verification, and remaining uncertainty. Mark each item **VERIFIED**, **SUPPORTED**, **UNVERIFIED**, or **CONTRADICTED**.
4. **Check adversarial conditions.** Examine invalid inputs, inconsistent state, missing data, boundary conditions, permission checks, credential exposure, unsafe defaults, external network calls, and rollback implications. Never print live secrets in your report.
5. **Verify or abstain.** Run available focused tests and capture exact commands and exit results. If execution is unavailable, state that it was not run. Never infer production correctness from a green unit test.
6. **Review regression surface.** Compare changed behavior with baseline contracts and existing tests. Look for behavior removed by an additive-looking change.
7. **Report findings by impact.** Include severity, file and line or function, reproducible steps or static evidence, recommended correction, and confidence. Separate blocking issues from non-blocking improvements.
8. **Recommend a gate.** Use **READY_FOR_REVIEW**, **CHANGES_REQUIRED**, or **INSUFFICIENT_EVIDENCE**. Do not merge or deploy unless separately authorized.

## Output contract

Use this structure:

- **Scope:** repo, base/head, paths inspected.
- **Observed evidence:** relevant test results and exact supporting locations.
- **Findings:** severity, impact, reproduction, and next action.
- **Unknowns:** missing integration, environmental, visual, load, or security verification.
- **Decision:** one gate state and rationale.

## Stop conditions

Stop and request review if sensitive data is exposed, a test changes production data, branch state differs from the inspected SHA, or review requires unapproved destructive operations. Abstention is a valid engineering result.
