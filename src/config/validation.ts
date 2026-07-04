import { z } from "zod";
import type { ZodIssue } from "zod";

const baseBuildEnvSchema = z.object({
    VITE_SENTRY_ORG: z.string().trim().optional(),
    VITE_SENTRY_PROJECT: z.string().trim().optional(),
    SENTRY_AUTH_TOKEN: z.string().trim().optional(),
    CI: z.coerce.boolean().optional().default(false),
});

export type BuildEnv = z.infer<typeof baseBuildEnvSchema>;

export interface ParseBuildEnvOptions {
    /**
     * Require Sentry source-map upload credentials when running in CI.
     * These are only needed for production builds that upload source maps;
     * the dev server (e.g. Playwright E2E) never uploads them, so callers
     * that only start a dev server should leave this disabled.
     */
    requireSentryInCi?: boolean;
}

function buildEnvSchemaFor(requireSentryInCi: boolean) {
    return baseBuildEnvSchema.superRefine((data, ctx) => {
        if (!requireSentryInCi || !data.CI) return;

        const requiredWhenCiIsTrue: Array<
            [
                key: "VITE_SENTRY_ORG" | "VITE_SENTRY_PROJECT" | "SENTRY_AUTH_TOKEN",
                value: string | undefined,
            ]
        > = [
            ["VITE_SENTRY_ORG", data.VITE_SENTRY_ORG],
            ["VITE_SENTRY_PROJECT", data.VITE_SENTRY_PROJECT],
            ["SENTRY_AUTH_TOKEN", data.SENTRY_AUTH_TOKEN],
        ];

        requiredWhenCiIsTrue.forEach(([key, value]) => {
            if (value) return;

            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [key],
                message: `${key} is required when CI=true`,
            });
        });
    });
}

export function parseBuildEnv(
    env: NodeJS.ProcessEnv | Record<string, string>,
    options: ParseBuildEnvOptions = {},
): BuildEnv {
    const { requireSentryInCi = true } = options;
    const result = buildEnvSchemaFor(requireSentryInCi).safeParse(env);

    if (result.success) return result.data;

    const issues = result.error.issues
        .map(
            (issue: ZodIssue) =>
                `${issue.path.join(".") || "(root)"}: ${issue.message}`,
        )
        .join("\n");

    throw new Error(`Invalid build environment variables:\n${issues}`);
}
