/// <reference types="@cloudflare/workers-types" />
// Workers runtime only; don't import in client code.
import { env as cfEnv } from "cloudflare:workers";
import { z } from "zod";

const runtimeEnvSchema = z.object({
    AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required").trim(),
    AWS_REGION: z.string().min(1, "AWS_REGION is required").trim(),
    AWS_ACCESS_KEY_ID: z.string().min(1, "AWS_ACCESS_KEY_ID is required").trim(),
    AWS_SECRET_ACCESS_KEY: z
        .string()
        .min(1, "AWS_SECRET_ACCESS_KEY is required")
        .trim(),
    SES_FROM_EMAIL: z.string().email("SES_FROM_EMAIL must be a valid email").trim(),
    SENTRY_DSN: z.string().trim().optional(),
});

export type RuntimeEnv = z.infer<typeof runtimeEnvSchema>;

export function getRuntimeEnv(): RuntimeEnv {
    const result = runtimeEnvSchema.safeParse(cfEnv);

    if (result.success) {
        return result.data;
    }

    const issues = result.error.issues
        .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
        .join("; ");

    throw new Error(`Missing or invalid runtime environment variables: ${issues}`);
}
