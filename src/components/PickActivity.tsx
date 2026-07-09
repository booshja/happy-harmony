import { useMutation } from "@tanstack/react-query";

import { pickActivity } from "../server/activities";

// The "pick one" nudge UI for a signed-in user (Slice 1, PRD JANDES-124 user stories
// 7/9/10). Pressing the button calls the `pickActivity` RPC, which is `userId`-scoped
// at the Repository Choke Point, so the result can only ever be one of the caller's
// own Activities — never another user's. An empty set returns `null`, surfaced here
// as a friendly "nothing to pick" message rather than an error. Stable data-testids
// feed the T8 E2E ticket.
export default function PickActivity() {
    const pick = useMutation({ mutationFn: () => pickActivity() });

    return (
        <section>
            <h2>Can't decide?</h2>
            <button
                type="button"
                data-testid="pick-one-button"
                onClick={() => pick.mutate()}
                disabled={pick.isPending}
            >
                {pick.isPending ? "Picking…" : "Pick one for me"}
            </button>
            {pick.isError && (
                <p data-testid="pick-one-error">
                    Something went wrong. Please try again.
                </p>
            )}
            {pick.isSuccess &&
                (pick.data === null ? (
                    <p data-testid="pick-one-empty">
                        Nothing to pick yet — add an activity first.
                    </p>
                ) : (
                    <p data-testid="pick-one-result">{pick.data.title}</p>
                ))}
        </section>
    );
}
