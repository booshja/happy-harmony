---
"happy-harmony": patch
---

JANDES-132: E2E exit — happy path + isolation smoke (Slice 1, T8). Adds Playwright
coverage proving the Slice-1 spine is genuinely usable end-to-end. A happy-path
journey signs up, creates a Category, creates an Activity under it, and presses
"pick one" — asserting the single Activity is returned (deterministic at one item).
An isolation smoke journey runs two users in separate browser contexts and asserts
user B never sees user A's Category or Activity and that "pick one" reports the
friendly empty state, exercising the per-user boundary from the browser. Tests reuse
the feed-forward selectors recorded by T3–T7 and use synthetic data only.
