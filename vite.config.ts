import { wrapVinxiConfigWithSentry } from "@sentry/tanstackstart-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

import { parseServerEnv } from "./src/config/validation";

export default defineConfig(({ mode }) => {
    // Load .env files into process.env for the current mode
    const env = parseServerEnv(loadEnv(mode, process.cwd(), ""));

    const config = {
        plugins: [
            // this is the plugin that enables path aliases
            viteTsConfigPaths({
                projects: ["./tsconfig.json"],
            }),
            tanstackStart(),
            viteReact({
                babel: {
                    plugins: ["babel-plugin-react-compiler"],
                },
            }),
        ],
    };

    const sentryOptions =
        env.VITE_SENTRY_ORG && env.VITE_SENTRY_PROJECT && env.SENTRY_AUTH_TOKEN
            ? {
                  org: env.VITE_SENTRY_ORG,
                  project: env.VITE_SENTRY_PROJECT,
                  authToken: env.SENTRY_AUTH_TOKEN,
                  // Only print logs for uploading source maps in CI
                  // Set to `true` to suppress logs
                  silent: !env.CI,
              }
            : null;

    return sentryOptions ? wrapVinxiConfigWithSentry(config, sentryOptions) : config;
});
