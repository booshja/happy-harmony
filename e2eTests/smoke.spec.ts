import { expect, test } from "@playwright/test";

test("home page renders baseline content", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Happy Harmony/i);
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(
        page.getByText("Edit src/routes/index.tsx and save to reload."),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Learn React" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Learn TanStack" })).toBeVisible();
});
