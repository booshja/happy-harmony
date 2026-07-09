import { createFileRoute } from "@tanstack/react-router";

import ActivityList from "../components/ActivityList";
import CategoryList from "../components/CategoryList";
import CreateActivityForm from "../components/CreateActivityForm";
import CreateCategoryForm from "../components/CreateCategoryForm";
import PickActivity from "../components/PickActivity";

export const Route = createFileRoute("/_authenticated/")({
    component: HomePage,
});

function HomePage() {
    const { session } = Route.useRouteContext();

    return (
        <div>
            <h1>Happy Harmony</h1>
            {session?.user && <p>Welcome, {session.user.name}!</p>}
            <CreateCategoryForm />
            <CategoryList />
            <CreateActivityForm />
            <ActivityList />
            <PickActivity />
        </div>
    );
}
