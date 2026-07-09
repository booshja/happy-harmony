// Pure, uniformly-random selection over a set — the heart of the "pick one" nudge
// (PRD JANDES-124, user stories 7/9/10). The randomness source is injected so unit
// tests can pin the drawn index and prove the distribution; production callers use
// the default `Math.random`. An empty set yields `null` — the "nothing to pick"
// signal callers turn into a friendly empty state rather than an error. No
// server-only imports, so it is unit-testable in isolation and reusable anywhere.
export function pickRandom<T>(
    items: ReadonlyArray<T>,
    random: () => number = Math.random,
): T | null {
    if (items.length === 0) {
        return null;
    }
    // Clamp guards a degenerate source returning exactly 1 (Math.random never does,
    // but an injected one might) from landing one past the last index.
    const index = Math.min(
        Math.floor(random() * items.length),
        items.length - 1,
    );
    return items[index] ?? null;
}
