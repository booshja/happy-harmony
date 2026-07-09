import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { FormEvent } from "react";

import {
    CATEGORY_NAME_MAX_LENGTH,
    categoryNameSchema,
} from "../lib/categorySchema";
import { createCategory } from "../server/categories";

import { CATEGORIES_QUERY_KEY } from "./CategoryList";

// Minimal create-Category UI for a signed-in user (Slice 1). Empty Categories are
// allowed — only the name is required. The server function is the authorization
// boundary; this client-side check is a courtesy that mirrors the same zod schema,
// never a substitute for server validation.
export default function CreateCategoryForm() {
    const queryClient = useQueryClient();
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [createdName, setCreatedName] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);
        setCreatedName(null);

        const parsed = categoryNameSchema.safeParse(name);
        if (!parsed.success) {
            setError(parsed.error.issues[0]?.message ?? "Invalid name.");
            return;
        }

        setSubmitting(true);
        try {
            const created = await createCategory({ data: { name: parsed.data } });
            setCreatedName(created.name);
            setName("");
            // Refresh the list so the just-created Category appears immediately.
            await queryClient.invalidateQueries({
                queryKey: CATEGORIES_QUERY_KEY,
            });
        } catch {
            // Content-free message: never surface raw errors (which could echo
            // input) to the user or logs.
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>New Category</h2>
            <div>
                <label htmlFor="category-name">Name</label>
                <br />
                <input
                    id="category-name"
                    name="category-name"
                    type="text"
                    value={name}
                    maxLength={CATEGORY_NAME_MAX_LENGTH}
                    onChange={(event) => setName(event.target.value)}
                    required
                />
            </div>
            {error && (
                <p data-testid="category-error" style={{ color: "red" }}>
                    {error}
                </p>
            )}
            {createdName && (
                <p data-testid="category-created">
                    Created category “{createdName}”.
                </p>
            )}
            <button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create Category"}
            </button>
        </form>
    );
}
