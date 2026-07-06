# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker (Linear).

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

These are modeled as **Linear labels** on the `JANDES` team, not workflow states. None existed at setup time; the skills create them on first use via `create_issue_label`. Edit the right-hand column to match whatever vocabulary you actually settle on.

## Loop-gating label (not a triage role)

`do-not-proceed` is **not** one of the five triage roles above — it's a hard brake for the headless sandcastle loop, modeled as a Linear label on the `JANDES` team.

| Label            | Meaning                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| `do-not-proceed` | Human-gated hard stop. The loop must never work this issue or anything it blocks, and must never override it. |

Semantics: a `do-not-proceed` issue behaves like an **unsatisfiable blocker** — it is dropped from the loop's ready list (the blocker gate in the List command; see `issue-tracker.md`), and because it never reaches a terminal state, every issue it blocks stays gated transitively. Use it as a **slice-boundary brake**: put it on the first issue you want the loop to stop _before_ (the wall), not the last issue you want done. Created on first use via `create_issue_label`.
