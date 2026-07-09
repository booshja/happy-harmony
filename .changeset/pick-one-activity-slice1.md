---
"happy-harmony": patch
---

JANDES-131: "Pick one" random Activity (Slice 1, T7). Adds a `pickActivity` RPC that
returns one uniformly-random Activity from the caller's own set through the
Repository Choke Point, drawing only from the caller-scoped read so another user's
Activity can never be picked. An empty set returns `null` — the friendly "nothing to
pick" signal, not an error. A pure `pickRandom` helper (injectable random source)
owns the randomness/empty/single-item edges under unit test, and a `PickActivity` UI
control surfaces the picked Activity or the empty-state message. Integration test
locks that selection never draws from another user's Activities.
