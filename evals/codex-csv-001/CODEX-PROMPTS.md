# Running the two Codex attempts

Launch **two new, independent Codex tasks** using the same connected repository. The two experiments must not share conversation context or generated patches.

## Control — branch `eval/codex-csv-control`

Use this exact instruction:

```text
Fix the CSV import problem described in issue #2 of gentian-hajdaraj/ai-search-visibility-italia, following the requirements in the issue. Preserve all existing APIs and metrics. Add tests and run the existing suite. Work only on the branch selected for this task. Open a pull request for review, do not merge or deploy. Explain the checks actually run and any unverified behavior. Do not read the evaluation harness in the separate ai-engineering-skills repository.
```

## Treatment — branch `eval/codex-csv-skill`

Use the same instruction with this **single additional sentence** at the beginning:

```text
Use the $release-regression-gate skill installed in this repository and follow its full gate and evidence output contract.
```

The treatment branch already contains `.agents/skills/release-regression-gate/SKILL.md`; the control branch does not.

## Safety and evidence

Use the **same Codex model and settings** for both tasks, without feeding one run's output into the other. Open a separate PR for each. Do not merge either branch before scoring. Save the two resulting PR URLs and, if surfaced, model, duration and token/cost information.

No `OPENAI_API_KEY` is needed for this **manual Codex product workflow**; it is distinct from running the Codex GitHub Action with billed API calls.

## After the runs

Provide both PR URLs to the reviewer. The evaluator is maintained separately under `evals/codex-csv-001/` here. Scoring is automated for functional checks but still requires human review of the change and the recorded run evidence.
