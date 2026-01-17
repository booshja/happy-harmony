import { createFileRoute } from "@tanstack/react-router";

type Todo = {
    id: number;
    name: string;
};

const todos: Array<Todo> = [
    {
        id: 1,
        name: "Buy groceries",
    },
    {
        id: 2,
        name: "Buy mobile phone",
    },
    {
        id: 3,
        name: "Buy laptop",
    },
];

export const Route = createFileRoute("/api/demo-tq-todos")({
    server: {
        handlers: {
            GET: () => {
                return Response.json(todos);
            },
            POST: async ({ request }) => {
                const body = await request.json();
                const name =
                    typeof body === "string" ? body : (body as { name?: unknown }).name;

                if (typeof name !== "string" || name.trim().length === 0) {
                    return Response.json(
                        { error: "name must be a non-empty string" },
                        { status: 400 },
                    );
                }

                const todo: Todo = {
                    id: todos.length + 1,
                    name: name.trim(),
                };
                todos.push(todo);
                return Response.json(todo);
            },
        },
    },
});
