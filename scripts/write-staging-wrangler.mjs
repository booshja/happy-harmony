/**
 * Patches dist/server/wrangler.json with staging-specific overrides and writes
 * dist/server/wrangler.staging.json for use by `wrangler deploy`.
 *
 * Run after `vite build`, before `wrangler deploy`.
 */

import fs from "node:fs";

const base = JSON.parse(fs.readFileSync("dist/server/wrangler.json", "utf8"));

// Strip single-line comments before parsing (wrangler.jsonc only uses //)
const sourceRaw = fs
    .readFileSync("wrangler.jsonc", "utf8")
    .replace(/^\s*\/\/.*$/gm, "");
const source = JSON.parse(sourceRaw);
const stagingEnv = source.env.staging;

const staging = {
    ...base,
    name: stagingEnv.name,
    routes: stagingEnv.routes,
    d1_databases: stagingEnv.d1_databases,
};

fs.writeFileSync("dist/server/wrangler.staging.json", JSON.stringify(staging, null, 2));
console.log("Wrote dist/server/wrangler.staging.json");
