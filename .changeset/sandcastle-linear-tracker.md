---
"happy-harmony": patch
---

Wire the sandcastle Ralph-loop issue tracker to Linear. The plan/implement/merge prompts now list, view, and close issues via the Linear GraphQL API (`curl` + `jq`, authenticated with `LINEAR_API_KEY`), scoped to the Happy Harmony project and gated on the `ready-for-agent` label; close transitions issues to Done. Adds `@ai-hero/sandcastle` and documents the headless GraphQL path (vs. the interactive MCP transport) in `docs/agents/issue-tracker.md`.
