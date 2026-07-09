# Every Activity belongs to exactly one Category

The domain model is `User > Category > Activity`: an Activity must always live
under exactly one owning Category. The current schema does not enforce this —
`activity.categoryId` is nullable with `onDelete: "set null"`, which allows
orphaned activities. We are correcting the schema to `categoryId notNull` with
`onDelete: "cascade"` so the data model matches the domain truth.

## Considered options

- **Nullable category (current schema)** — rejected: allows category-less
  activities, which contradicts the intended hierarchy.
- **Block deletion while a category has activities** — rejected: forces the user
  to manually empty a category first, tedious for a personal tool.
- **Cascade delete behind a confirmation** — chosen.

## Consequences

- An empty Category is valid (you create it, then add activities into it).
- Deleting a Category cascade-deletes its Activities, gated by a confirmation
  dialog ("This will delete the category and its N activities").
- Creating an Activity requires an existing Category **owned by the caller** — see
  ADR 0003's parent-ownership check.
- A schema migration is required to change `categoryId` to non-null + cascade.

## Migration gating (dev-only relaxation)

The "no schema migrations without approval" rule is **relaxed for dev only**,
because there is no live data yet. The Slice 1 prefactor migration
(`drizzle/0001_mixed_gressill.sql` — `categoryId` → non-null + cascade, plus
relaxing `activity.duration`, `category.description`, and `activity.description`
to nullable so a name-only / title-only create is possible) was generated and
applied under this relaxation. This **must be re-gated behind approval before
the first production data lands**.
