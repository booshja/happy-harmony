import { Link, useRouter } from "@tanstack/react-router";

import { authClient } from "../auth/client";

export default function Header() {
    const { data: session } = authClient.useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut();
        router.invalidate();
        router.navigate({ to: "/login" });
    };

    return (
        <header className="p-2 flex gap-2 bg-white text-black justify-between">
            <nav className="flex flex-row">
                <div className="px-2 font-bold">
                    <Link to="/">Home</Link>
                </div>
            </nav>
            <div className="flex items-center gap-2">
                {session?.user ? (
                    <>
                        <span>{session.user.name}</span>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="px-2 font-bold"
                        >
                            Log out
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="px-2 font-bold">
                        Log in
                    </Link>
                )}
            </div>
        </header>
    );
}
