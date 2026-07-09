// Parallel Planner with Review — four-phase orchestration loop
//
// This template drives a multi-phase workflow:
//   Phase 1 (Plan):             An opus agent analyzes open issues, builds a
//                               dependency graph, and outputs a <plan> JSON
//                               listing unblocked issues with branch names.
//   Phase 2 (Execute + Review): For each issue, a sandbox is created via
//                               createSandbox(). The implementer runs first
//                               (100 iterations). If it produces commits, a
//                               reviewer runs in the same sandbox on the same
//                               branch (1 iteration). All issue pipelines run
//                               concurrently via Promise.allSettled().
//   Phase 3 (Merge):            A single agent merges all completed branches
//                               into the current branch.
//
// The outer loop repeats up to MAX_ITERATIONS times so that newly unblocked
// issues are picked up after each round of merges.
//
// Usage:
//   npx tsx .sandcastle/main.ts
// Or add to package.json:
//   "scripts": { "sandcastle": "npx tsx .sandcastle/main.ts" }

import { mkdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join } from "node:path";

import * as sandcastle from "@ai-hero/sandcastle";
import { docker } from "@ai-hero/sandcastle/sandboxes/docker";
import { z } from "zod";

// The planner emits its plan as JSON inside <plan> tags; Output.object extracts
// and validates it against this schema. We use Zod here, but any Standard
// Schema validator works just as well — Valibot, ArkType, etc. See
// https://standardschema.dev.
const planSchema = z.object({
    issues: z.array(
        z.object({ id: z.string(), title: z.string(), branch: z.string() }),
    ),
});

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

// Maximum number of plan→execute→merge cycles before stopping.
// Raise this if your backlog is large; lower it for a quick smoke-test run.
const MAX_ITERATIONS = 10;

// Hooks run inside the sandbox before the agent starts each iteration.
// `pnpm install --frozen-lockfile` keeps the sandbox in sync with the committed
// pnpm-lock.yaml (this repo is pnpm-only; a plain `npm install` would ignore the
// lockfile and re-resolve from ranges).
//
// `--store-dir` pins the pnpm content-addressable store to a container-local
// path. Without it, pnpm resolves the store from ambient config — and a local,
// gitignored `pnpm-workspace.yaml` on the host may carry an absolute host
// `storeDir` (e.g. /Users/<you>/Library/pnpm/store) into the Linux sandbox,
// where the non-root agent user can't create it (EACCES → install exits 243).
//
// `--store-dir` also targets the persistent, per-project store bind-mounted
// below (see `mounts`), so the store survives across sandboxes.
//
// `timeoutMs` overrides the 60s hook default: the FIRST run against a cold store
// hydrates the whole dependency tree from the network (~45s+ for this tree),
// which overran 60s. Once the store is warm, reconciling the copied node_modules
// takes ~1s — the timeout is headroom for that first cold run.
const hooks = {
    sandbox: {
        onSandboxReady: [
            {
                command:
                    "pnpm install --frozen-lockfile --store-dir /home/agent/.pnpm-store",
                timeoutMs: 300_000,
            },
        ],
    },
};

// ---------------------------------------------------------------------------
// Persistent pnpm store (per project)
// ---------------------------------------------------------------------------

// Bind-mount a host directory as the sandbox pnpm store so it persists and warms
// across runs. Without this, every sandbox starts cold and re-fetches the full
// dependency tree from the network. Scoped by the working-directory name so each
// project keeps its own store — unrelated repos can't share or corrupt one another's.
const pnpmStoreHostPath = join(
    homedir(),
    ".cache",
    "sandcastle",
    basename(process.cwd()),
    "pnpm-store",
);
// The docker provider fails sandbox creation if a mount's hostPath is missing.
mkdirSync(pnpmStoreHostPath, { recursive: true });

// Mount the host store at the container path the hook passes to `--store-dir`.
// Reused by every docker() sandbox below so they share one warm store.
const mounts = [
    { hostPath: pnpmStoreHostPath, sandboxPath: "/home/agent/.pnpm-store" },
];

// Copy node_modules from the host into the worktree before each sandbox
// starts. Avoids a full install from scratch; the hook above reconciles it
// against the lockfile and handles any packages added since the last copy.
const copyToWorktree = ["node_modules"];

// ---------------------------------------------------------------------------
// Linear routing
// ---------------------------------------------------------------------------

// Parse a KEY=VALUE env file into a plain object. Skips blanks and `#` comment
// lines, strips inline `# …` comments and surrounding quotes. Deliberately
// minimal — just enough for the committed routing file, no extra dependency.
function parseEnvFile(filePath: string): Record<string, string> {
    const result: Record<string, string> = {};
    for (const rawLine of readFileSync(filePath, "utf8").split("\n")) {
        const line = rawLine.trim();
        if (line === "" || line.startsWith("#")) continue;
        const eq = line.indexOf("=");
        if (eq === -1) continue;
        const key = line.slice(0, eq).trim();
        // Strip an inline comment, but only when the value isn't quoted — a `#`
        // inside a quoted value is data, not a comment.
        let value = line.slice(eq + 1).trim();
        if (value.startsWith('"') || value.startsWith("'")) {
            const quote = value[0];
            const end = value.indexOf(quote, 1);
            value = end === -1 ? value.slice(1) : value.slice(1, end);
        } else {
            const hash = value.indexOf("#");
            if (hash !== -1) value = value.slice(0, hash).trim();
        }
        if (key !== "") result[key] = value;
    }
    return result;
}

// Non-secret Linear routing (team, project, workflow-state UUIDs, gate labels)
// the headless prompts interpolate as `$LINEAR_*` in their curl/jq shell blocks.
// Injected as the sandbox-provider env below so it lands in the same sandbox
// environment as the auto-loaded secret LINEAR_API_KEY. Keep this OFF the
// agent-provider env — sandcastle throws if a key appears in both.
const linearEnv = parseEnvFile("./.sandcastle/linear.env");

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------

for (let iteration = 1; iteration <= MAX_ITERATIONS; iteration++) {
    console.log(`\n=== Iteration ${iteration}/${MAX_ITERATIONS} ===\n`);

    // -------------------------------------------------------------------------
    // Phase 1: Plan
    //
    // The planning agent (opus, for deeper reasoning) reads the open issue list,
    // builds a dependency graph, and selects the issues that can be worked in
    // parallel right now (i.e., no blocking dependencies on other open issues).
    //
    // It outputs a <plan> JSON block — Output.object parses and validates it.
    // -------------------------------------------------------------------------
    const plan = await sandcastle.run({
        hooks,
        sandbox: docker({ env: linearEnv, mounts }),
        name: "planner",
        // One iteration is enough: the planner just needs to read and reason,
        // not write code. (Structured output requires maxIterations: 1.)
        maxIterations: 1,
        // Opus for planning: dependency analysis benefits from deeper reasoning.
        agent: sandcastle.claudeCode("claude-opus-4-8"),
        promptFile: "./.sandcastle/plan-prompt.md",
        // Extract and validate the <plan> JSON into a typed object. Throws
        // StructuredOutputError if the tag is missing, the JSON is malformed, or
        // validation fails — which aborts the loop.
        output: sandcastle.Output.object({ tag: "plan", schema: planSchema }),
    });

    const issues = plan.output.issues;

    if (issues.length === 0) {
        // No unblocked work — either everything is done or everything is blocked.
        console.log("No unblocked issues to work on. Exiting.");
        break;
    }

    console.log(`Planning complete. ${issues.length} issue(s) to work in parallel:`);
    for (const issue of issues) {
        console.log(`  ${issue.id}: ${issue.title} → ${issue.branch}`);
    }

    // -------------------------------------------------------------------------
    // Phase 2: Execute + Review
    //
    // For each issue, create a sandbox via createSandbox() so the implementer
    // and reviewer share the same sandbox instance per branch. The implementer
    // runs first; if it produces commits, the reviewer runs in the same sandbox.
    //
    // Promise.allSettled means one failing pipeline doesn't cancel the others.
    // -------------------------------------------------------------------------

    const settled = await Promise.allSettled(
        issues.map(async (issue) => {
            const sandbox = await sandcastle.createSandbox({
                branch: issue.branch,
                sandbox: docker({ env: linearEnv, mounts }),
                hooks,
                copyToWorktree,
            });

            try {
                // Run the implementer
                const implement = await sandbox.run({
                    name: "implementer",
                    maxIterations: 100,
                    agent: sandcastle.claudeCode("claude-opus-4-8"),
                    promptFile: "./.sandcastle/implement-prompt.md",
                    promptArgs: {
                        TASK_ID: issue.id,
                        ISSUE_TITLE: issue.title,
                        BRANCH: issue.branch,
                    },
                });

                // Only review if the implementer produced commits
                if (implement.commits.length > 0) {
                    const review = await sandbox.run({
                        name: "reviewer",
                        maxIterations: 1,
                        agent: sandcastle.claudeCode("claude-opus-4-8"),
                        promptFile: "./.sandcastle/review-prompt.md",
                        promptArgs: {
                            BRANCH: issue.branch,
                        },
                    });

                    // Merge commits from both runs so the merge phase sees all of them.
                    // Each sandbox.run() only returns commits from its own run.
                    return {
                        ...review,
                        commits: [...implement.commits, ...review.commits],
                    };
                }

                return implement;
            } finally {
                await sandbox.close();
            }
        }),
    );

    // Log any agents that threw (network error, sandbox crash, etc.).
    for (const [i, outcome] of settled.entries()) {
        if (outcome.status === "rejected") {
            console.error(
                `  ✗ ${issues[i]!.id} (${issues[i]!.branch}) failed: ${outcome.reason}`,
            );
        }
    }

    // Only pass branches that actually produced commits to the merge phase.
    // An agent that ran successfully but made no commits has nothing to merge.
    const completedIssues = settled
        .map((outcome, i) => ({ outcome, issue: issues[i]! }))
        .filter(
            (entry) =>
                entry.outcome.status === "fulfilled" &&
                entry.outcome.value.commits.length > 0,
        )
        .map((entry) => entry.issue);

    const completedBranches = completedIssues.map((i) => i.branch);

    console.log(
        `\nExecution complete. ${completedBranches.length} branch(es) with commits:`,
    );
    for (const branch of completedBranches) {
        console.log(`  ${branch}`);
    }

    if (completedBranches.length === 0) {
        // All agents ran but none made commits — nothing to merge this cycle.
        console.log("No commits produced. Nothing to merge.");
        continue;
    }

    // -------------------------------------------------------------------------
    // Phase 3: Merge
    //
    // One agent merges all completed branches into the current branch,
    // resolving any conflicts and running tests to confirm everything works.
    //
    // The {{BRANCHES}} and {{ISSUES}} prompt arguments are lists that the agent
    // uses to know which branches to merge and which issues to close.
    // -------------------------------------------------------------------------
    await sandcastle.run({
        hooks,
        sandbox: docker({ env: linearEnv, mounts }),
        name: "merger",
        maxIterations: 1,
        agent: sandcastle.claudeCode("claude-opus-4-8"),
        promptFile: "./.sandcastle/merge-prompt.md",
        promptArgs: {
            // A markdown list of branch names, one per line.
            BRANCHES: completedBranches.map((b) => `- ${b}`).join("\n"),
            // A markdown list of issue IDs and titles, one per line.
            ISSUES: completedIssues.map((i) => `- ${i.id}: ${i.title}`).join("\n"),
        },
    });

    console.log("\nBranches merged.");
}

console.log("\nAll done.");
