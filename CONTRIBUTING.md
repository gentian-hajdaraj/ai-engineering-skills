# Contributing

Thank you for improving evidence-first AI engineering. Contributions should prioritize clear, repeatable workflows that make unsupported assumptions visible.

## Proposing a change

- Open an issue explaining the problem and a realistic use case.
- Work on a branch and submit a focused pull request.
- Preserve the Agent Skills YAML frontmatter (`name` and `description`).
- Keep skills self-contained, concise, task-driven and safe by default.
- Add or update an example when changing a skill's output contract.
- Run `node --test scripts/validate.mjs` and disclose anything not tested.

Avoid third-party copyrighted text without a compatible license. Do not include confidential customer data, API tokens, private business code or proprietary model prompts. Do not claim universal agent compatibility: verify behavior in the runtime you test.

## Review principles

A maintainer can request clarification, counterexamples, security evidence or smaller changes. Passing CI is necessary for repository structure, not sufficient for correctness or safety.
