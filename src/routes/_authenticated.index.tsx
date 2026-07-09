import { createFileRoute } from "@tanstack/react-router";

import CreateCategoryForm from "../components/CreateCategoryForm";

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
        </div>
    );
}
