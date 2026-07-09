---
"happy-harmony": patch
---

JANDES-129: Activity create with parent-ownership (Slice 1, T5). Adds a
`createActivity` RPC that validates with zod, derives `userId` from the session, and
mints the `displayId`. The new Activity Repository enforces the parent-ownership
boundary at the Repository Choke Point (ADR-0003): the target Category is resolved
`WHERE userId = caller`, so creating under a Category the caller does not own is
rejected server-side. A `CreateActivityForm` UI lets the signed-in user pick a parent
Category from their own list (`listCategories`, T4) and create a title-only Activity.
Integration test proves a user cannot create an Activity under another user's Category.
