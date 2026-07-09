---
"happy-harmony": patch
---

Ensure the Sandcastle Docker image is built before the AFK loop runs.

- Add a `sandcastle:build-image` script that wraps `sandcastle docker build-image`
  with the repo's image name (`sandcastle:happy-harmony`) and `.sandcastle/Dockerfile`.
- Prepend that build to the `sandcastle` script so every run refreshes the image
  first. Docker layer caching makes an unchanged rebuild a ~2s no-op, and it
  automatically picks up Dockerfile edits — avoiding the stale/"image not found
  locally" failure at worktree-create time.
- Pin the sandbox `pnpm install` to a container-local `--store-dir`
  (`/home/agent/.pnpm-store`). Otherwise a local, gitignored `pnpm-workspace.yaml`
  carrying an absolute host `storeDir` leaks into the Linux sandbox, where the
  non-root agent user can't create that path (EACCES → install exits 243).
- Raise that hook's `timeoutMs` to 300s. Each fresh sandbox has a cold pnpm
  store, so the first install hydrates from the network and overran the 60s
  hook default.
- Persist the pnpm store across sandboxes via a per-project host bind-mount
  (`~/.cache/sandcastle/<project>/pnpm-store` → `/home/agent/.pnpm-store`),
  scoped by working-directory name. After the first (cold) run warms it,
  reconciling the copied node_modules drops from ~45s to ~1s. All docker()
  sandboxes (planner, per-issue, merger) share the one warm store.
