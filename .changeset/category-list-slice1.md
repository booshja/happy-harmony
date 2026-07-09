---
"happy-harmony": patch
---

JANDES-128: Category list (Slice 1, T4). Adds a `listCategories` RPC that reads
through the Repository Choke Point, `userId`-scoped, so it only ever returns the
caller's own Categories. A `CategoryList` UI lists the signed-in user's Categories
(with a friendly empty state), and the create form invalidates the list query so a
newly created Category appears immediately. Integration test locks that user A's
list never includes user B's Categories.
