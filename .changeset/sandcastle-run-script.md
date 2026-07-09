---
"happy-harmony": patch
---

Add pnpm scripts for driving the Sandcastle AFK loop (`.sandcastle/main.ts`):

- `sandcastle` — run the plan/implement/review/merge loop in the foreground via `tsx`.
- `sandcastle:bg` — run it detached with `nohup`, capturing the orchestrator's stdout narration to a timestamped `.sandcastle/logs/loop-*.log` and printing the PID and a `tail -f` hint. (Per-agent run logs are already written under `.sandcastle/logs/` by Sandcastle's default file logging.)
- `sandcastle:logs:clean` — prune `.sandcastle/logs/*.log` older than 14 days, since neither the auto per-run logs nor the loop logs are otherwise rotated.

Previously the loop could only be started with an ad-hoc `npx tsx .sandcastle/main.ts` invocation. Secrets are still auto-loaded from `.sandcastle/.env`, so no `--env-file` flag is required.
