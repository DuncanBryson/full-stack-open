const { test, expect, beforeEach, describe } = require("@playwright/test");
const { login } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Tester",
        username: "test",
        password: "sekurity",
      },
    });
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("Username")).toBeVisible();
    await expect(page.getByText("Password")).toBeVisible();
  });
  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await login(page, "test", "sekurity");
      const notification = await page.locator(".notification");
      await expect(notification).toContainText("Logged in as test");
      await expect(notification).toHaveCSS("color", "rgb(0, 128, 0)");
    });
    test("fails with wrong credentials", async ({ page }) => {
      await login(page, "test", "wrongpassword");
      const notification = await page.locator(".notification");
      await expect(notification).toContainText("invalid username or password");
      await expect(notification).toHaveCSS("color", "rgb(255, 0, 0)");
    });
  });
});
