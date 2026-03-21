/**
 * Patches dist/server/wrangler.json with staging-specific overrides and writes
 * dist/server/wrangler.staging.json for use by `wrangler deploy`.
 *
 * Run after `vite build`, before `wrangler deploy`.
 */

import fs from "node:fs";

const base = JSON.parse(fs.readFileSync("dist/server/wrangler.json", "utf8"));

const staging = {
    ...base,
    name: "happy-harmony-staging",
    routes: [{ pattern: "staging.happyharmony.dev", custom_domain: true }],
    d1_databases: [
        {
            binding: "DB",
            database_name: "happy-harmony-staging",
            database_id: "4cf700d6-e8d9-4006-b508-60c4a676d6fb",
        },
    ],
};

fs.writeFileSync("dist/server/wrangler.staging.json", JSON.stringify(staging, null, 2));
console.log("Wrote dist/server/wrangler.staging.json");
