# Sitevory OAuth — public CI build mirror

This branch is a **source-only, sanitized and non-deployable** verification of the Sitevory OAuth bridge. No live Cloudflare account identifier, KV namespace ID, WordPress domain, production endpoint, passwords, or tokens are published.

The original source is included as five base64 chunks of a gzip tar archive, with SHA-256 verified in CI. To inspect it: `cat sitevory-ci/source.part*.b64 | base64 -d > sitevory.tar.gz && mkdir -p sitevory-src && tar -xzf sitevory.tar.gz -C sitevory-src`.

GitHub Actions installs the pinned Node dependencies, runs strict TypeScript typechecking and a Wrangler dry-run. **No deploy, no WordPress calls, no secrets**. The public `npm run deploy` deliberately fails.

Only the separate, previously prepared private WordPress/MCP package contains the complete pilot tests and real configuration. Passing this public build does **not** prove WordPress authentication or OAuth end-to-end operation.
