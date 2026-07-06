# Issue tracker: Linear

Issues and PRDs for this repo live as **Linear issues**. The transport depends on how the agent is running:

- **Interactive dev** — operations go through the **Linear MCP server** (`https://mcp.linear.app/mcp`); the Conventions below name MCP tools.
- **Headless (sandcastle Ralph-loop)** — there is no MCP client in the sandbox, so operations hit the **raw GraphQL API** (`https://api.linear.app/graphql`) with `curl` + `jq`. See [Headless commands](#headless-commands-sandcastle). If you're an agent running inside the sandbox, use those commands — do **not** try to call MCP tools.

## Authentication

Linear has no first-party CLI; the MCP server is the agent interface. It supports two auth modes — use whichever matches how the skill is being run.

- **Interactive (normal dev).** Default OAuth 2.1. Connect the client to `https://mcp.linear.app/mcp` and authorize in the browser once. This is the mode for hands-on Claude Code sessions.
- **Headless (sandboxed / Ralph-loop, e.g. sandcastle).** No MCP client and no browser OAuth in a sandbox, so the loop calls the **raw GraphQL API** (`https://api.linear.app/graphql`) directly with `curl` + `jq`, authenticated with a **scoped personal API key** in the header. The GraphQL API takes the personal key **raw — no `Bearer` prefix**: `Authorization: ${LINEAR_API_KEY}`. (The `Bearer` prefix is only for the MCP / OAuth transport; sending it to the GraphQL API fails.) Create the key at Linear → Settings → Security & access → API, scoped to this workspace's team and restricted to the operations the loop performs (read issues, update issue state). The loop acts as _you_. The concrete list/view/close commands live in `.sandcastle/*.md` — see [Headless commands](#headless-commands-sandcastle).
    - _If you later want the loop to post as a distinct bot identity, swap in an app-actor token — it doesn't consume a Linear seat, but requires creating an OAuth application. Not needed for solo use._

**Secrets vs. routing.** `LINEAR_API_KEY` is a secret consumed by the MCP transport layer — it lives only in the orchestrator's env (e.g. sandcastle's `.sandcastle/.env`), never in this committed file, and the agent never reads it directly. The **Target** below is non-secret routing the agent _does_ read, so it lives here in the repo.

> sandcastle caveat: it throws if the agent-provider `env` and sandbox-provider `env` share a key. Put `LINEAR_API_KEY` in exactly one of them.

## Headless commands (sandcastle)

Inside the sandcastle sandbox there is **no MCP** — the plan/implement/merge prompts (`.sandcastle/*.md`) shell out to the GraphQL API. These are the source of truth for the three baked-in commands; edit them there if the tracker shape changes.

All three POST to `https://api.linear.app/graphql` with `Authorization: $LINEAR_API_KEY` (raw, no `Bearer`) and `Content-Type: application/json`, piping through `jq`.

- **List** (in `plan-prompt.md`) — open, agent-ready issues in the project, as a JSON array of `{id, title, body}`. Filtered to `project == Happy Harmony`, label `ready-for-agent`, and workflow-state type **not** `completed`/`canceled`:

    ```
    query { issues(first: 250, filter: {
      project: { id: { eq: "e083d04b-0285-472e-9316-7115a505d2c3" } },
      labels:  { name: { eq: "ready-for-agent" } },
      state:   { type: { nin: ["completed", "canceled"] } }
    }) { nodes { identifier title description } } }
    ```

    `jq '[.data.issues.nodes[] | {id: .identifier, title: .title, body: .description}]'` reshapes `identifier`→`id` and `description`→`body`. An empty array (no `ready-for-agent` issues) is expected and makes the loop exit cleanly — the label is the opt-in gate for AFK work.

- **View `<ID>`** (in `implement-prompt.md`) — `query { issue(id: "<ID>") { ... } }`. Linear's `issue(id:)` accepts the human identifier (`JANDES-123`) as well as the UUID.

- **Close `<ID>`** (in `merge-prompt.md`) — `mutation { issueUpdate(id: "<ID>", input: { stateId: "4e87981d-b4ee-41d0-9a39-4d8fd195789a" }) { success } }`. `issueUpdate` needs a **state UUID**, not a type; `4e87981d-…` is team `JANDES`'s `Done` state. For a `wontfix`, swap in the `Canceled` state UUID instead. Re-resolve these via `list_issue_statuses` if the team's workflow changes.

## Target

Linear addresses issues by **team**, and a git checkout knows nothing about your workspace — so operations must be pinned to a fixed target. Every "create" or "list" operation below uses:

```
Team: JANDES              # Booshja team; the JANDES-### prefix on issues/branches
Project: Happy Harmony    # UUID e083d04b-0285-472e-9316-7115a505d2c3 if the name is ambiguous
```

Resolve these by name via `list_teams` / `list_projects`. If a project name is ambiguous, replace `Project:` with the project's UUID.

## Conventions

Tool names track the official hosted server and may drift; if a name below isn't present, fall back to the equivalent tool the connected server exposes.

- **Create an issue**: `create_issue` with `title`, `description` (markdown), the `Team`, and the `Project` from Target.
- **Read an issue**: `get_issue` by identifier (e.g. `JANDES-123`), then `list_comments` for the conversation.
- **List issues**: `list_issues` filtered by the `Project`, plus `label` / `status` / `assignee` as needed.
- **Comment on an issue**: `create_comment`.
- **Apply / remove labels**: `update_issue`, setting the issue's label set. Ensure the label exists first with `list_issue_labels`; create missing ones with `create_issue_label`. See `triage-labels.md` for the role strings — the five canonical triage roles are modeled as **Linear labels**, not workflow states.
- **Close**: `update_issue`, setting the workflow state to a terminal state (`Done`, or `Canceled` for `wontfix`). Closing is the one place Linear's state model is unavoidable — labels handle triage routing, states handle open/closed.

## Pull requests as a triage surface

**N/A.** Linear doesn't host pull requests. Code review lives in your git host (GitHub — `booshja/happy-harmony`); PRs _link_ to Linear issues via the Git integration (branch name or magic words like `Fixes JANDES-123`). There is no separate PR triage queue in Linear, so `/triage` reads only issues.

## When a skill says "publish to the issue tracker"

Create a Linear issue (`create_issue`) in the `Team` / `Project` from Target.

## When a skill says "fetch the relevant ticket"

`get_issue` by identifier, then `list_comments`. The user will normally pass the identifier (e.g. `JANDES-123`) directly.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single issue with **child** issues as tickets.

- **Map**: a single issue labelled `wayfinder:map`, holding the Notes / Decisions-so-far / Fog body. `create_issue` with that label in the Target project. (Not a Linear Project — those are per-repo and long-lived; a wayfinder effort is smaller and disposable, so an issue is the right grain.)
- **Child ticket**: a native **sub-issue** of the map — `create_issue` with `parentId` set to the map. Labels: `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`), plus `wayfinder:claimed` once claimed.
- **Blocking**: use Linear's native **blocked-by** relation if the connected server exposes a tool for it; otherwise fall back to a `Blocked by: JANDES-12, JANDES-15` line at the top of the child's description. A ticket is unblocked when every issue it lists is in a terminal state (`Done`/`Canceled`).
- **Frontier query**: `list_issues` scoped to the map's sub-issues, drop any that are non-open, carry the `wayfinder:claimed` label, or have an unresolved blocker; first in map order wins.
- **Claim**: `update_issue` adding the `wayfinder:claimed` label — the session's first write.
- **Resolve**: `create_comment` with the answer, then `update_issue` to set the workflow state to `Done`, then append a context pointer (gist + link) to the map's Decisions-so-far.
