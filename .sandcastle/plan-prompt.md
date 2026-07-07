# ISSUES

Here are the open issues in the repo:

<issues-json>

!`curl -sS -X POST https://api.linear.app/graphql -H "Authorization: $LINEAR_API_KEY" -H "Content-Type: application/json" --data '{"query":"query { issues(first: 250, filter: { project: { id: { eq: \"'"$LINEAR_PROJECT_ID"'\" } }, labels: { name: { eq: \"'"$LINEAR_READY_LABEL"'\" } }, state: { type: { nin: [\"completed\", \"canceled\"] } } }) { nodes { identifier title description labels { nodes { name } } inverseRelations { nodes { type issue { state { type } } } } } } }"}' | jq '[.data.issues.nodes[] | select(any(.labels.nodes[]?.name; . == "'"$LINEAR_HOLD_LABEL"'") | not) | select([.inverseRelations.nodes[] | select(.type == "blocks") | .issue.state.type | (. == "completed" or . == "canceled")] | all) | {id: .identifier, title: .title, body: .description}]'`

</issues-json>

The list above is already **ready and unblocked**: every issue whose explicit `blocked-by` relations are not all resolved has been removed, as has any issue held under a `do-not-proceed` hard stop.

> An issue carrying `do-not-proceed` is a **human-gated wall** — never work it or anything it blocks, and never override that because an issue looks ready. (Enforced upstream in the query; restated here so it holds even if the list ever leaks one through.)

# TASK

Your job is the **secondary conflict check**: among these already-unblocked issues, select a maximal set that can safely be worked **in parallel this round** without colliding.

Treat issue B as one to **defer** (not this round) if:

- B and another listed issue modify overlapping files or modules, making concurrent work likely to produce merge conflicts.
- B's requirements depend on an API shape or decision another listed issue will establish — a dependency the explicit `blocked-by` graph didn't capture.

Deferring is safe: a deferred issue is simply picked up in a later round once the issue it would collide with has merged. When two issues collide with each other, run **one** and defer the other — never emit both, never defer both.

For each issue you select, assign a branch name using the exact format `sandcastle/issue-{id}` (no slug or other suffix). This must be deterministic so that re-planning the same issue always produces the same branch name and accumulated progress is preserved.

# OUTPUT

Output your plan as a JSON object wrapped in `<plan>` tags:

<plan>
{"issues": [{"id": "42", "title": "Fix auth bug", "branch": "sandcastle/issue-42"}]}
</plan>

Include only the issues you selected for this round. If the pre-filtered list above is empty, output `<plan>{"issues": []}</plan>` so the run exits cleanly. Never force a `do-not-proceed`-held or explicitly-blocked issue into the plan.

Always emit the `<plan>` tags, even when there is nothing to do. If there are no issues to work on at all, output `<plan>{"issues": []}</plan>` so the run can exit cleanly.
