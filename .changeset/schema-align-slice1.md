---
"happy-harmony": patch
---

JANDES-125: Schema alignment migration for Slice 1 (prefactor). `activity.categoryId`
is now `NOT NULL` with `onDelete: cascade`, and `activity.duration`,
`category.description`, and `activity.description` are relaxed to nullable so a
name-only / title-only create is possible. Adds Drizzle migration
`0001_mixed_gressill`; `userId` tenancy columns are unchanged. Records the
dev-only migration-gating relaxation in ADR-0002.
