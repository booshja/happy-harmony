# Organize work as tracer-bullet vertical slices, not horizontal phase milestones

The original plan used horizontal, concern-based milestones (A: Runs everywhere,
B: Account & privacy posture, C: MVP end-to-end, D: Launch polish). Returning to
it after ~3 months, it was very hard to tell what was done and what was next, and
the structure forced building whole layers (all of privacy, then all of features)
before anything was usable. We are restructuring work into **tracer bullets** —
thin end-to-end vertical slices, each independently usable and verifiable — because
self-orientation after time away and incremental usability are explicit goals.

## Consequences

- Each Vertical Slice maps to a Linear **Milestone** whose description holds the
  Slice Charter; the milestone list becomes the "where are we / what's next" view.
- Cross-cutting concerns (per-user isolation, the test pyramid, no-PII-to-Sentry,
  a11y baseline) stop being separate milestones and become **per-slice acceptance
  criteria** — the only way "privacy posture" is continuously true rather than a
  phase passed through once.
- "A: Runs everywhere" is kept as the foundations milestone (mostly done). B, C,
  and D dissolve into per-slice criteria and re-sliced tickets.
- We specify only the current slice in detail; later slices stay as one-line
  placeholders marked "re-slice before starting," so learnings reshape only the
  active slice, not the whole backlog.
