---
name: safe-open-source-extraction
description: Extract a minimal, reusable public tool from a private SaaS or client project without leaking secrets, customer information, proprietary algorithms, or licensed assets. Use when preparing open-source releases, public demos, or research companion repositories.
---

# Safe open-source extraction

Goal: publish **independent, useful functionality** while preserving privacy, security, ownership and business advantage.

## Procedure

1. **Define a public boundary.** Specify user problem, smallest useful public contract, inputs, outputs, and excluded proprietary capabilities. Prefer a clean-room standalone implementation when practical.
2. **Classify sources.** Label every dependency and data source as owned-and-publishable, third-party/restricted, customer-confidential, secret, or unknown. Unknown ownership is a release blocker.
3. **Choose the artifact.** Favor an independent source tree or new repository with a fresh history. Avoid making an existing production repository public; even deleted secrets may remain in its Git history.
4. **Use safe demo data.** Provide clearly synthetic test data. Do not ship production event traces, customer identifiers, real API responses, access tokens, or proprietary model prompts.
5. **Audit all outputs.** Inspect code, assets, docs, logs, screenshots, release ZIPs, Git history, workflow configuration, hidden files, and package metadata for sensitive information and accidental network endpoints.
6. **Check licenses.** Verify third-party licenses and trademark usage. State a precise license **scope** for newly published code versus existing research datasets and documents.
7. **Document honesty.** Explain what the tool does, does not do, reproducibility limits, minimum requirements, safety limitations, and which conclusions cannot be inferred from its output.
8. **Isolate verification.** Run tests in a non-production environment. Check external network behavior and imports; do not make publication depend on privileged access to a private system.
9. **Review release diff.** Record exactly which paths will become public; require an explicit, separate sign-off before exposing any previously private repository or remote production config.

## Publication memo

Report:

- **Included:** public paths, licenses, user-facing contract.
- **Excluded:** preserved private algorithms, data, credentials, customer-specific functionality.
- **Evidence:** tests performed, security checks, independent runtime behavior.
- **Unknowns:** ownership or review gaps.
- **Decision:** **PUBLIC_READY**, **NEEDS_REVIEW**, or **DO_NOT_PUBLISH**.

Never declare a private production codebase safe to publish based only on the absence of files named `.env`.
