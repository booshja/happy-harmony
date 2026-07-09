import { useQuery } from "@tanstack/react-query";

import { listCategories } from "../server/categories";

// The query key the create form invalidates after a successful write, so a newly
// created Category appears in this list without a manual refresh.
export const CATEGORIES_QUERY_KEY = ["categories"] as const;

// Minimal Category list for a signed-in user (Slice 1). Reads through the
// `listCategories` RPC, which is `userId`-scoped at the Repository Choke Point, so
// another user's Categories can never surface here. Empty is a friendly state, not
// an error.
export default function CategoryList() {
    const { data, isPending, isError } = useQuery({
        queryKey: CATEGORIES_QUERY_KEY,
        queryFn: () => listCategories(),
    });

    if (isPending) {
        return <p data-testid="category-list-loading">Loading your categories…</p>;
    }

    if (isError) {
        return (
            <p data-testid="category-list-error">
                Something went wrong loading your categories.
            </p>
        );
    }

    return (
        <section>
            <h2>Your Categories</h2>
            {data.length === 0 ? (
                <p data-testid="category-list-empty">
                    No categories yet. Create one above to get started.
                </p>
            ) : (
                <ul data-testid="category-list">
                    {data.map((cat) => (
                        <li key={cat.displayId} data-testid="category-list-item">
                            {cat.name}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
