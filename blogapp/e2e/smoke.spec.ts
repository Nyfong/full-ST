import { test, expect } from "@playwright/test";

test.describe("Public pages", () => {
  test("home loads with MetaBlog title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/MetaBlog/);
  });

  test("login page shows welcome heading", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /Welcome back/i })).toBeVisible();
  });
});

test.describe("Security (guest)", () => {
  test("admin URL redirects guest to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });
});
