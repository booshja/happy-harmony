import { expect, test } from "@playwright/test";

import { signUp, uniqueEmail } from "./helpers/auth";
import { createActivity, createCategory } from "./helpers/data";

// T8 — the Slice-1 exit gate (PRD JANDES-124, user stories 21/22). Two Playwright
// journeys prove the vertical spine is genuinely usable end-to-end and that the
// per-user isolation boundary holds from the browser's point of view. Built after
// the features exist (E2E resists TDD); consumes the feed-forward selectors T3–T7
// recorded on JANDES-132. All content is synthetic — no real user data.
test.describe("slice 1 exit", () => {
    // Happy path: sign in → create Category → create Activity → "pick one" returns
    // that Activity. With exactly one Activity, the uniformly-random draw can only
    // return it, so the assertion is deterministic (user story 10).
    test("happy path: create category, activity, then pick one", async ({
        page,
    }) => {
        await signUp(page, { name: "Happy User", email: uniqueEmail() });

        await createCategory(page, "Outdoors");
        await createActivity(page, {
            categoryName: "Outdoors",
            title: "Go for a hike",
        });

        await page.getByTestId("pick-one-button").click();
        await expect(page.getByTestId("pick-one-result")).toHaveText(
            "Go for a hike",
        );
    });

    // Isolation smoke: user B, in a fully separate browser context, never sees user
    // A's Category or Activity, and "pick one" reports the friendly empty state
    // rather than surfacing A's content (user stories 8/14). The boundary is owned
    // at the Repository Choke Point and locked by the integration tests; this is the
    // end-to-end smoke that the UI honours it.
    test("isolation smoke: user B cannot see user A's data", async ({
        browser,
    }) => {
        const secretCategory = "A Private Category";
        const secretActivity = "A Private Activity";

        const contextA = await browser.newContext();
        const contextB = await browser.newContext();
        try {
            const pageA = await contextA.newPage();
            await signUp(pageA, { name: "User A", email: uniqueEmail() });
            await createCategory(pageA, secretCategory);
            await createActivity(pageA, {
                categoryName: secretCategory,
                title: secretActivity,
            });

            const pageB = await contextB.newPage();
            await signUp(pageB, { name: "User B", email: uniqueEmail() });

            // B starts empty and stays empty — A's rows are invisible.
            await expect(
                pageB.getByTestId("category-list-empty"),
            ).toBeVisible();
            await expect(
                pageB.getByTestId("activity-list-empty"),
            ).toBeVisible();
            await expect(pageB.getByText(secretCategory)).toHaveCount(0);
            await expect(pageB.getByText(secretActivity)).toHaveCount(0);

            // "pick one" draws only from B's (empty) set.
            await pageB.getByTestId("pick-one-button").click();
            await expect(pageB.getByTestId("pick-one-empty")).toBeVisible();
        } finally {
            await contextA.close();
            await contextB.close();
        }
    });
});
