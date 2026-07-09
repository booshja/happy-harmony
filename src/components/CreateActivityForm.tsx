import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { FormEvent } from "react";

import {
    ACTIVITY_TITLE_MAX_LENGTH,
    createActivityInputSchema,
} from "../lib/activitySchema";
import { createActivity } from "../server/activities";
import { listCategories } from "../server/categories";

import { ACTIVITIES_QUERY_KEY } from "./ActivityList";
import { CATEGORIES_QUERY_KEY } from "./CategoryList";

// Minimal create-Activity UI for a signed-in user (Slice 1). The user picks a parent
// Category from their OWN list (`listCategories`, `userId`-scoped at the choke point)
// and enters a title — metadata is deferred. The server function is the
// authorization boundary and re-runs the parent-ownership check; this client-side
// validation is a courtesy that mirrors the same zod schema, never a substitute.
export default function CreateActivityForm() {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState("");
    const [categoryDisplayId, setCategoryDisplayId] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [createdTitle, setCreatedTitle] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const {
        data: categories,
        isPending,
        isError,
    } = useQuery({
        queryKey: CATEGORIES_QUERY_KEY,
        queryFn: () => listCategories(),
    });

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError(null);
        setCreatedTitle(null);

        const parsed = createActivityInputSchema.safeParse({
            title,
            categoryDisplayId,
        });
        if (!parsed.success) {
            setError(parsed.error.issues[0]?.message ?? "Invalid activity.");
            return;
        }

        setSubmitting(true);
        try {
            const created = await createActivity({ data: parsed.data });
            setCreatedTitle(created.title);
            setTitle("");
            // Refresh the list so the just-created Activity appears immediately.
            await queryClient.invalidateQueries({
                queryKey: ACTIVITIES_QUERY_KEY,
            });
        } catch {
            // Content-free message: never surface raw errors (which could echo
            // input) to the user or logs.
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (isPending) {
        return (
            <p data-testid="activity-categories-loading">
                Loading your categories…
            </p>
        );
    }

    if (isError) {
        return (
            <p data-testid="activity-categories-error">
                Something went wrong loading your categories.
            </p>
        );
    }

    // Without a Category there is nothing to create an Activity under (ADR-0002).
    if (categories.length === 0) {
        return (
            <p data-testid="activity-no-categories">
                Create a category first, then you can add an activity to it.
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>New Activity</h2>
            <div>
                <label htmlFor="activity-title">Title</label>
                <br />
                <input
                    id="activity-title"
                    name="activity-title"
                    type="text"
                    value={title}
                    maxLength={ACTIVITY_TITLE_MAX_LENGTH}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="activity-category">Category</label>
                <br />
                <select
                    id="activity-category"
                    name="activity-category"
                    data-testid="activity-category-select"
                    value={categoryDisplayId}
                    onChange={(event) =>
                        setCategoryDisplayId(event.target.value)
                    }
                    required
                >
                    <option value="" disabled>
                        Pick a category…
                    </option>
                    {categories.map((cat) => (
                        <option key={cat.displayId} value={cat.displayId}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>
            {error && (
                <p data-testid="activity-error" style={{ color: "red" }}>
                    {error}
                </p>
            )}
            {createdTitle && (
                <p data-testid="activity-created">
                    Created activity “{createdTitle}”.
                </p>
            )}
            <button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create Activity"}
            </button>
        </form>
    );
}
