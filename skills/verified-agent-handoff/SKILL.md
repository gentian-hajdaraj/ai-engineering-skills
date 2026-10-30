---
name: verified-agent-handoff
description: Produce a reliable handoff between AI coding sessions or agents using repository evidence, pinned commits, tested results, unresolved uncertainties and safe next steps. Use when a task spans long conversations, multiple agents, or handovers between teams.
---

# Verified agent handoff

Goal: let the next agent resume work **without inventing progress**, mixing incompatible branches, or repeating dangerous operations.

## Gather verifiable context

1. **Identify project identity.** Record repository, active task, environment, relevant branch/PR, baseline SHA and last checked head SHA. Separate user-requested goals from actual completed work.
2. **Audit work completed.** List changed paths, commits, PRs, tests and artifacts. Label each item as observed in tools, reported by another agent, or unverified. Don't invent URLs, command results or file locations.
3. **Capture engineering contracts.** State invariants that must not be broken: APIs, schema, deployment restrictions, ownership boundaries, safety gates and any research/evidence rules.
4. **State live blockers.** Identify CI status, failing tests, conflicts, missing permission, infrastructure constraints, incomplete approvals and data gaps.
5. **Describe the next action.** Recommend the smallest safe next step and the exact checks needed before it. Never imply permission to merge, deploy or publish private code unless it was granted.
6. **Prune context.** Keep concise decisions, irreversible changes and links to authoritative sources; remove speculative analysis and repeated narrative.

## Required handoff template

    event_time: <UTC ISO8601 or NOT_OBSERVED>
    repository: <owner/repo>
    branch: <branch or UNKNOWN>
    baseline_sha: <commit or UNKNOWN>
    verified_head_sha: <commit or UNKNOWN>
    goal: <one sentence>
    completed: <verified items with evidence links>
    tests: <exact command, outcome, source, or NOT_RUN>
    unknowns: <missing facts and checks>
    invariants: <non-negotiable contracts>
    permissions: <what is authorized and what is not>
    next_step: <smallest safe next action>

## Quality gate

- **READY_TO_HANDOFF:** essential facts checked against current sources and constraints preserved.
- **HANDOFF_WITH_GAPS:** material checks missing; marked explicitly.
- **BLOCKED:** critical identity, branch, sensitive state or permission uncertain.

Use **HANDOFF_WITH_GAPS** rather than silently declaring stale CI or old branch state current. Protect private access tokens, customer data and unpublished proprietary context; prefer references to secrets instead of including their values.
