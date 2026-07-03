import { expect, test } from "@playwright/test";

import { signIn, signOut, signUp, uniqueEmail } from "./helpers/auth";

test.describe("auth flows", () => {
    test("signup creates account and redirects to home", async ({ page }) => {
        const email = uniqueEmail();

        await signUp(page, { name: "Test User", email });

        await expect(page.getByText("Welcome, Test User!")).toBeVisible();
        await expect(page.getByRole("button", { name: "Log out" })).toBeVisible();
        await expect(page.getByText("Test User", { exact: true })).toBeVisible();
    });

    test("login with valid credentials", async ({ page }) => {
        const email = uniqueEmail();

        await signUp(page, { name: "Login User", email });
        await signOut(page);
        await signIn(page, { email });

        await expect(page.getByText("Welcome, Login User!")).toBeVisible();
        await expect(page.getByText("Login User", { exact: true })).toBeVisible();
    });

    test("login with invalid credentials shows error", async ({ page }) => {
        await page.goto("/login");
        await page.waitForLoadState("networkidle");
        await page.locator("#email").fill("nonexistent@test.com");
        await page.locator("#password").fill("wrongpassword");
        await page.getByRole("button", { name: "Log In" }).click();

        await expect(page.locator("[data-testid='auth-error']")).toBeVisible();
        expect(page.url()).toContain("/login");
    });

    test("signup with duplicate email shows error", async ({ page }) => {
        const email = uniqueEmail();

        await signUp(page, { name: "First User", email });
        await signOut(page);

        await page.goto("/signup");
        await page.waitForLoadState("networkidle");
        await page.locator("#name").fill("Duplicate User");
        await page.locator("#email").fill(email);
        await page.locator("#password").fill("testpass123");
        await page.getByRole("button", { name: "Sign Up" }).click();

        await expect(page.locator("[data-testid='auth-error']")).toBeVisible();
    });

    test("logout clears session", async ({ page }) => {
        const email = uniqueEmail();

        await signUp(page, { name: "Logout User", email });
        await signOut(page);

        await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();

        await page.goto("/");
        await page.waitForURL(/\/login/);
    });

    test("protected route redirects unauthenticated users", async ({ page }) => {
        await page.goto("/");
        await page.waitForURL(/\/login/);
    });

    test("session persists across page refresh", async ({ page }) => {
        const email = uniqueEmail();

        await signUp(page, { name: "Persistent User", email });
        await page.reload();

        await expect(page.getByText("Welcome, Persistent User!")).toBeVisible();
        await expect(page.getByText("Persistent User", { exact: true })).toBeVisible();
    });

    test("redirect back after login", async ({ page }) => {
        await page.goto("/");
        await page.waitForURL(/\/login/);

        expect(page.url()).toContain("redirect=");

        const email = uniqueEmail();

        // Sign up via the signup page first, then sign out and use the redirect flow
        await signUp(page, { name: "Redirect User", email });
        await signOut(page);

        // Now visit / to trigger the redirect to /login?redirect=...
        await page.goto("/");
        await page.waitForURL(/\/login/);
        await page.waitForLoadState("networkidle");

        await page.locator("#email").fill(email);
        await page.locator("#password").fill("testpass123");
        await page.getByRole("button", { name: "Log In" }).click();

        await page.waitForURL("/");
        await expect(page.getByText("Welcome, Redirect User!")).toBeVisible();
    });

    test("authenticated user visiting /login redirects to home", async ({ page }) => {
        const email = uniqueEmail();

        await signUp(page, { name: "Auth Redirect User", email });
        await page.goto("/login");

        await page.waitForURL("/");
    });
});
