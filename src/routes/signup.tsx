import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {  useState } from "react";
import type {FormEvent} from "react";

import { authClient } from "../auth/client";

export const Route = createFileRoute("/signup")({
    beforeLoad: ({ context }) => {
        if (context.session) {
            throw redirect({ to: "/" });
        }
    },
    component: SignupPage,
});

function SignupPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error: signUpError } = await authClient.signUp.email({
            email,
            password,
            name,
        });

        if (signUpError) {
            setError(signUpError.message ?? "Sign up failed");
            setLoading(false);
            return;
        }

        navigate({ to: "/" });
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <br />
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                        minLength={8}
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                </button>
            </form>
            <p>
                Already have an account? <a href="/login">Log in</a>
            </p>
        </div>
    );
}
