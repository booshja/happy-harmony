import { expect, test } from "@playwright/test";

test("unauthenticated visit redirects to login", async ({ page }) => {
    await page.goto("/");

    await page.waitForURL(/\/login/);

    await expect(page).toHaveTitle(/Happy Harmony/i);
    await expect(page.getByRole("heading", { name: "Log In" })).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Log In" })).toBeVisible();
});
