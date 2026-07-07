---
"happy-harmony": patch
---

Extract the sandcastle loop's non-secret Linear routing into a committed `.sandcastle/linear.env` (team key, project id/name, `Done`/`Canceled` state UUIDs, and the ready/hold gate labels). `main.ts` parses it and injects it as the sandbox-provider env for the planner, per-issue, and merger sandboxes, so the plan/merge prompts interpolate `$LINEAR_*` in their `curl`/`jq` shell blocks instead of hardcoding the values. Collapses a triplication — the same identifiers were previously restated in `plan-prompt.md`, `merge-prompt.md`, and `docs/agents/issue-tracker.md`, which now point at `linear.env` as the single source of truth. The secret `LINEAR_API_KEY` stays in the gitignored `.sandcastle/.env`.
