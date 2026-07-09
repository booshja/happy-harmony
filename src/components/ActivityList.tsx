import { useQuery } from "@tanstack/react-query";

import { listActivities } from "../server/activities";
import { listCategories } from "../server/categories";

import { CATEGORIES_QUERY_KEY } from "./CategoryList";

// The query key the create form invalidates after a successful write, so a newly
// created Activity appears in this list without a manual refresh.
export const ACTIVITIES_QUERY_KEY = ["activities"] as const;

// Minimal Activity list for a signed-in user (Slice 1). Reads through the
// `listActivities` RPC, which is `userId`-scoped at the Repository Choke Point, so
// another user's Activities can never surface here. Activities are grouped under
// their parent Category (joined via `categoryDisplayId`). Empty is a friendly
// state, not an error.
export default function ActivityList() {
    const categoriesQuery = useQuery({
        queryKey: CATEGORIES_QUERY_KEY,
        queryFn: () => listCategories(),
    });
    const activitiesQuery = useQuery({
        queryKey: ACTIVITIES_QUERY_KEY,
        queryFn: () => listActivities(),
    });

    if (categoriesQuery.isPending || activitiesQuery.isPending) {
        return (
            <p data-testid="activity-list-loading">Loading your activities…</p>
        );
    }

    if (categoriesQuery.isError || activitiesQuery.isError) {
        return (
            <p data-testid="activity-list-error">
                Something went wrong loading your activities.
            </p>
        );
    }

    const categories = categoriesQuery.data;
    const activities = activitiesQuery.data;

    if (activities.length === 0) {
        return (
            <section>
                <h2>Your Activities</h2>
                <p data-testid="activity-list-empty">
                    No activities yet. Create one above to get started.
                </p>
            </section>
        );
    }

    // Only render Categories that actually have Activities, so the list stays a
    // confirmation of what was saved rather than a wall of empty groups.
    const groups = categories
        .map((category) => ({
            category,
            items: activities.filter(
                (activity) =>
                    activity.categoryDisplayId === category.displayId,
            ),
        }))
        .filter((group) => group.items.length > 0);

    return (
        <section>
            <h2>Your Activities</h2>
            <ul data-testid="activity-list">
                {groups.map(({ category, items }) => (
                    <li
                        key={category.displayId}
                        data-testid="activity-group"
                    >
                        <h3>{category.name}</h3>
                        <ul>
                            {items.map((activity) => (
                                <li
                                    key={activity.displayId}
                                    data-testid="activity-list-item"
                                >
                                    {activity.title}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </section>
    );
}
