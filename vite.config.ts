import path from "node:path";

import { cloudflare } from "@cloudflare/vite-plugin";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

import { parseBuildEnv } from "./src/config/validation";

export default defineConfig((configEnv) => {
    const { command, mode, ssrBuild } = configEnv as typeof configEnv & {
        ssrBuild?: boolean;
    };
    const isSsrBuild = Boolean(ssrBuild);
    const isVitest = process.env.VITEST === "true";
    const isPlaywright = process.env.PLAYWRIGHT_TEST === "true";
    const shouldAliasDevtools =
        isSsrBuild || command === "build" || isVitest || isPlaywright;
    const shouldUseCloudflare = !isVitest;

    const shouldSkipEnvLoad = process.env.SKIP_ENV_LOAD === "true";

    const envFromFiles: Record<string, string> = shouldSkipEnvLoad
        ? {}
        : loadEnv(mode, process.cwd(), "");

    // Load .env files into process.env for the current mode.
    // Sentry source-map upload credentials are only required for production
    // builds; the dev server (e.g. Playwright E2E) never uploads source maps.
    const env = parseBuildEnv(
        {
            ...process.env,
            ...envFromFiles,
        },
        { requireSentryInCi: command === "build" },
    );

    const devtoolsStub = {
        "@tanstack/react-devtools": path.resolve(__dirname, "src/stubs/devtools.tsx"),
        "@tanstack/react-router-devtools": path.resolve(
            __dirname,
            "src/stubs/devtools.tsx",
        ),
        "@tanstack/react-query-devtools": path.resolve(
            __dirname,
            "src/stubs/devtools.tsx",
        ),
    };

    const plugins = [
        // this is the plugin that enables path aliases
        viteTsConfigPaths({
            projects: ["./tsconfig.json"],
        }),
        tanstackStart(),
        ...(shouldUseCloudflare
            ? [
                  cloudflare({
                      viteEnvironment: { name: "ssr" },
                  }),
              ]
            : []),
        viteReact({
            babel: {
                plugins: ["babel-plugin-react-compiler"],
            },
        }),
    ];

    const sentryOptions =
        env.CI &&
        env.VITE_SENTRY_ORG &&
        env.VITE_SENTRY_PROJECT &&
        env.SENTRY_AUTH_TOKEN
            ? {
                  org: env.VITE_SENTRY_ORG,
                  project: env.VITE_SENTRY_PROJECT,
                  authToken: env.SENTRY_AUTH_TOKEN,
                  // Only print logs for uploading source maps in CI
                  // Set to `true` to suppress logs
                  silent: !env.CI,
              }
            : null;

    const enableSourcemaps = Boolean(sentryOptions);

    if (sentryOptions) {
        plugins.push(
            sentryVitePlugin({
                org: sentryOptions.org,
                project: sentryOptions.project,
                authToken: sentryOptions.authToken,
                telemetry: false,
            }),
        );
    }

    const config = {
        plugins,
        resolve: {
            alias: shouldAliasDevtools ? devtoolsStub : {},
        },
        build: {
            // Needed so Sentry can match uploaded artifacts to source maps
            sourcemap: enableSourcemaps,
        },
        test: {
            globals: true,
            environment: "jsdom",
            setupFiles: ["./vitest.setup.ts"],
            exclude: ["e2e/**/*", "node_modules/**/*", "dist/**/*"],
        },
    };

    return config;
});
