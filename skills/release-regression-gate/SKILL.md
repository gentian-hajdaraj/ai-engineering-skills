---
name: release-regression-gate
description: Check whether an app, API, WordPress plugin, or service release is safe to ship using baseline behavior, tests, changed-file review, deployment constraints, and rollback readiness. Use before merging or deploying AI-generated code.
---

# Release regression gate

Goal: provide a reproducible, evidence-backed go/no-go recommendation **before** publishing a change.

## Inputs to establish

- Repository and pinned candidate commit SHA.
- Target environment (local, staging, production) and its runtime constraints.
- Explicit changed behavior and protected existing behavior.
- Test commands, observed checks, deployment method, and available rollback path.

If a critical input is unknown, mark it unknown instead of assuming a default.

## Gate sequence

1. **Baseline:** identify last known-good commit or release and the behaviors it protects. Confirm whether the target environment matches local tests.
2. **Change map:** list modified modules, external interfaces, configuration, schema, routes, dependencies, and user-visible workflows.
3. **Focused regressions:** test the reported bug or new behavior, then adjacent features most likely to break. Include empty, duplicate, invalid, slow, and unauthorized inputs as relevant.
4. **Environment checks:** verify versions and deployment assumptions. In PHP/shared-host setups, do not require Node or Python on the production server unless confirmed; use CI or a separate build runner for such work.
5. **Security and data integrity:** check credentials, authorization, user input, logging, data migration safety, and changes to persistent records. Do not publish tokens or customer information.
6. **Delivery evidence:** collect CI results, command exit codes, smoke-test outcomes, and relevant screenshots only if they were actually inspected. A static HTML review is not visual QA.
7. **Rollback:** state the exact previous artifact/commit and how the release can be reverted. If rollback cannot be established, flag that limitation before production deployment.
8. **Decision:** use **GO**, **GO_WITH_LIMITATIONS**, or **NO_GO**, with evidence and the explicit limitations.

## Gate semantics

- **GO:** critical checks passed with evidence and no known blocking issue.
- **GO_WITH_LIMITATIONS:** scoped release may proceed with clearly identified unverified checks and authorized risk acceptance.
- **NO_GO:** broken checks, unsafe migration, exposed secrets, missing required rollback, or unknown critical behavior.

Do not automatically merge, alter deployment settings, or publish a release without the operator's approval. Do not describe untested behavior as confirmed.
