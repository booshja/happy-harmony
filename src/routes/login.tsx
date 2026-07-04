import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import { z } from "zod";

import { authClient } from "../auth/client";

export const Route = createFileRoute("/login")({
    validateSearch: z.object({
        redirect: z.string().optional(),
    }),
    beforeLoad: ({ context }) => {
        if (context.session) {
            throw redirect({ to: "/" });
        }
    },
    component: LoginPage,
});

function LoginPage() {
    const search = Route.useSearch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error: signInError } = await authClient.signIn.email({
            email,
            password,
        });

        if (signInError) {
            setError(signInError.message ?? "Sign in failed");
            setLoading(false);
            return;
        }

        navigate({ to: search.redirect ?? "/" });
    };

    return (
        <div>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <br />
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <br />
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && (
                    <p data-testid="auth-error" style={{ color: "red" }}>
                        {error}
                    </p>
                )}
                <button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Log In"}
                </button>
            </form>
            <p>
                Don&apos;t have an account? <a href="/signup">Sign up</a>
            </p>
        </div>
    );
}
