# Happy Harmony

Happy Harmony helps a user organize the activities they enjoy into categories and
decide what to do next, avoiding immediate repeats. The activity content a user
types is treated as sensitive by default.

## Language

### Domain entities

**Category**:
A user-owned grouping that an Activity lives under. Every Activity belongs to
exactly one Category (`User > Category > Activity`). A Category may be empty.
_Avoid_: Group, folder, tag.

**Activity**:
A user-created thing-to-do, owned by a user and belonging to exactly one Category.
Carries a title and optional metadata (notes, duration, setup effort). Highest-
sensitivity data in the system — if the user typed it, treat it as sensitive.
_Avoid_: Task, item, entry, event.

### Planning

**Tracer Bullet**:
A thin, end-to-end slice of work that pierces every layer the feature touches
(auth → data → logic → UI) as narrowly as possible, so the architecture is proven
and the result is actually usable. The unit we plan and sequence work in.
_Avoid_: Spike, prototype, MVP, phase.

**Vertical Slice**:
The scope of one Tracer Bullet, modeled in Linear as a Milestone. Each Slice is
independently usable and verifiable, and carries its own cross-cutting acceptance
criteria (isolation, tests, minimal polish) rather than deferring them to a later
phase.
_Avoid_: Layer, horizontal milestone, workstream.

**Slice Charter**:
The short statement of a Slice's goal, its "definition of usable," and its
non-negotiable acceptance criteria. Lives in the Linear milestone description so
the plan is self-orienting after time away.
_Avoid_: Spec, epic description, brief.

### Architecture & posture

**Repository Choke Point**:
The single data-access layer through which all reads and writes to user-owned
tables must pass. It requires a `userId` and scopes every query by it, so the
`WHERE userId = caller` clause is the one place the authorization boundary is
enforced and tested.
_Avoid_: DAO, model layer, service layer.

**Rigor Level A**:
The project's data-handling posture: apply HIPAA-grade _care_ as a design
principle (strong per-user isolation, minimal logging, no user content to third
parties) while deliberately **not** pursuing formal HIPAA compliance. Happy
Harmony is not a covered entity and integrates with no health systems.
_Avoid_: Compliant, HIPAA-compliant, regulated.

**Opaque External Identity**:
Every user-owned row carries two identities: an internal autoincrement integer
`id` used only for storage and foreign-key joins, never crossing a wire or
interface; and an opaque `displayId` that is the sole identity exposed externally
(responses, URLs, logs, Sentry). The Repository Choke Point speaks `displayId`
exclusively and mints it on create; the numeric `id` is module-private. This is
**defense-in-depth and enumeration-prevention**, not the authorization boundary —
per ADR 0003 unguessability is _not_ treated as authorization; the
`WHERE userId = caller` scope is. A leaked or logged `displayId` reveals nothing
and cannot be enumerated, and sequential counts never leak.
_Avoid_: Public id, slug, UUID (as an authz mechanism), obscured id.
