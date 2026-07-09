---
"happy-harmony": patch
---

JANDES-130: Activity list (Slice 1, T6). Adds a `listActivities` RPC that reads
through the Repository Choke Point, `userId`-scoped at `activity.userId`, so it only
ever returns the caller's own Activities — each carrying its parent Category's
`displayId` for grouping. An `ActivityList` UI groups the signed-in user's
Activities under their Category (with a friendly empty state), and the create form
invalidates the activities query so a newly created Activity appears immediately.
Integration test locks that user A's Activities never appear for user B.
