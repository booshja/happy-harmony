import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useCallback, useState } from "react";

type Todo = { id: number; name: string };

const todos: Array<Todo> = [
    { id: 1, name: "Get groceries" },
    { id: 2, name: "Buy a new phone" },
];

function readTodos(): Array<Todo> {
    return todos;
}

const getTodos = createServerFn({
    method: "GET",
}).handler(() => readTodos());

const addTodo = createServerFn({ method: "POST" })
    .inputValidator((d: string) => d)
    .handler(({ data }) => {
        const currentTodos = readTodos();
        currentTodos.push({ id: currentTodos.length + 1, name: data });
        return currentTodos;
    });

export const Route = createFileRoute("/demo/start/server-funcs")({
    component: Home,
    loader: () => getTodos(),
});

function Home() {
    const router = useRouter();
    const todoList = Route.useLoaderData();

    const [todo, setTodo] = useState("");

    const submitTodo = useCallback(async () => {
        await addTodo({ data: todo });
        setTodo("");
        router.invalidate();
    }, [router, todo]);

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-800 to-black p-4 text-white"
            style={{
                backgroundImage:
                    "radial-gradient(50% 50% at 20% 60%, #23272a 0%, #18181b 50%, #000000 100%)",
            }}
        >
            <div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
                <h1 className="text-2xl mb-4">Start Server Functions - Todo Example</h1>
                <ul className="mb-4 space-y-2">
                    {todoList.map((t: Todo) => (
                        <li
                            key={t.id}
                            className="bg-white/10 border border-white/20 rounded-lg p-3 backdrop-blur-sm shadow-md"
                        >
                            <span className="text-lg text-white">{t.name}</span>
                        </li>
                    ))}
                </ul>
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        value={todo}
                        onChange={(e) => setTodo(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                submitTodo();
                            }
                        }}
                        placeholder="Enter a new todo..."
                        className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                    <button
                        disabled={todo.trim().length === 0}
                        onClick={submitTodo}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        Add todo
                    </button>
                </div>
            </div>
        </div>
    );
}
