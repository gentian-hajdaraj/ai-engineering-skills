# Shared Codex task — CSV import hardening

Repository: `gentian-hajdaraj/ai-search-visibility-italia`  
Issue: https://github.com/gentian-hajdaraj/ai-search-visibility-italia/issues/2

Work on the branch selected for this run; do not merge into `main`.

## Task

Investigate and fix handling of malformed double-quote sequences in the CSV importer in `tools/visibility-benchmark-lite/benchmark-core.js`.

Requirements:

- Reject invalid quote patterns instead of silently interpreting malformed fields as valid data.
- Preserve correct parsing of standard quoted fields, escaped double quotes, commas and line breaks inside quoted fields, CRLF, and optional UTF-8 BOM.
- Preserve the public `parseCSV` and `analyze` API and all research-specific semantics (surface presence, control queries, mention/recommendation/citation distinctions, percentages).
- Add focused regression tests to the **existing** test suite.
- Do not add external runtime dependencies, change the official research data, call an external API, or modify production.
- Run existing and new tests. Clearly state what was and wasn't checked, and cite paths/functions.
- Commit your work only to your own evaluation branch. Prepare a PR for review, but **do not merge**.

## Output

Summarize implementation, evidence from tests, residual risks, relevant commit SHA, and PR link if one was opened. Do not claim browser checks without running them.
