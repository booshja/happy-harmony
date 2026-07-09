import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

// Slice-1 UI helpers for driving the create-Category / create-Activity forms on the
// authenticated home page. Selectors mirror the feed-forward E2E notes recorded by
// T3–T7 on JANDES-132 (category-name input, activity-title input,
// activity-category-select, and the *-created / *-list-item confirmations). All data
// passed in is synthetic — callers own the strings.

// Create a Category through the UI and wait for it to appear in the caller's list.
export async function createCategory(page: Page, name: string) {
    await page.locator("#category-name").fill(name);
    await page.getByRole("button", { name: "Create Category" }).click();
    await expect(page.getByTestId("category-created")).toBeVisible();
    await expect(
        page.getByTestId("category-list-item").filter({ hasText: name }),
    ).toBeVisible();
}

// Create an Activity under an existing Category through the UI and wait for it to
// appear grouped in the caller's Activity list.
export async function createActivity(
    page: Page,
    opts: { categoryName: string; title: string },
) {
    await page.locator("#activity-title").fill(opts.title);
    // The parent-Category <select> is fed by the same `listCategories` query the list
    // above renders, so once the Category list item is visible the option exists too.
    await page
        .getByTestId("activity-category-select")
        .selectOption({ label: opts.categoryName });
    await page.getByRole("button", { name: "Create Activity" }).click();
    await expect(page.getByTestId("activity-created")).toBeVisible();
    await expect(
        page.getByTestId("activity-list-item").filter({ hasText: opts.title }),
    ).toBeVisible();
}
