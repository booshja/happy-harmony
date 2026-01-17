import { z } from "zod";
import type { ZodIssue } from "zod";

export const buildEnvSchema = z
    .object({
        VITE_SENTRY_ORG: z.string().trim().optional(),
        VITE_SENTRY_PROJECT: z.string().trim().optional(),
        SENTRY_AUTH_TOKEN: z.string().trim().optional(),
        CI: z.coerce.boolean().optional().default(false),
    })
    .superRefine((data, ctx) => {
        if (!data.CI) return;

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

export type BuildEnv = z.infer<typeof buildEnvSchema>;

export function parseBuildEnv(
    env: NodeJS.ProcessEnv | Record<string, string>,
): BuildEnv {
    const result = buildEnvSchema.safeParse(env);

    if (result.success) return result.data;

    const issues = result.error.issues
        .map(
            (issue: ZodIssue) =>
                `${issue.path.join(".") || "(root)"}: ${issue.message}`,
        )
        .join("\n");

    throw new Error(`Invalid build environment variables:\n${issues}`);
}
