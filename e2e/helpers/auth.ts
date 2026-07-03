import { randomUUID } from "node:crypto";

import type { Page } from "@playwright/test";

const TEST_PASSWORD = "testpass123";

export function uniqueEmail() {
    return `test-${randomUUID().slice(0, 8)}@test.com`;
}

export async function signUp(
    page: Page,
    opts: { email: string; name: string; password?: string },
) {
    const password = opts.password ?? TEST_PASSWORD;

    await page.goto("/signup");
    await page.waitForLoadState("networkidle");
    await page.locator("#name").fill(opts.name);
    await page.locator("#email").fill(opts.email);
    await page.locator("#password").fill(password);
    await page.getByRole("button", { name: "Sign Up" }).click();
    await page.waitForURL("/");
}

export async function signIn(page: Page, opts: { email: string; password?: string }) {
    const password = opts.password ?? TEST_PASSWORD;

    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.locator("#email").fill(opts.email);
    await page.locator("#password").fill(password);
    await page.getByRole("button", { name: "Log In" }).click();
    await page.waitForURL("/");
}

export async function signOut(page: Page) {
    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL(/\/login/);
}
