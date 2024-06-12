const { test, expect, beforeEach, describe } = require("@playwright/test");
const { login, addBlog } = require("./helper");

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
  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await login(page, "test", "sekurity");
      await addBlog(
        page,
        "Old Blog",
        "OldAuthor",
        "https://www.definitelyawebsite.com"
      );
    });

    test("a new blog can be created", async ({ page }) => {
      await addBlog(
        page,
        "New Blog Title",
        "BlogAuthor",
        "https://www.notawebsite.com"
      );

      await expect(page.getByText("New Blog Title BlogAuthor")).toBeVisible();
      const notification = await page.locator(".notification");
      await expect(notification).toContainText("New Blog Title by BlogAuthor");
      await expect(notification).toHaveCSS("color", "rgb(0, 128, 0)");
    });
    test("a blog can be liked", async ({ page }) => {
      await page.getByRole("button", { name: "view" }).click();
      const likeButton = () => {
        page.getByRole("button", { name: "like" }).click();
      };
      await likeButton();
      await expect(page.getByText("1 like")).toBeVisible();
      await likeButton();
      await expect(page.getByText("2 like")).toBeVisible();
    });
    test("a blog can be deleted", async ({ page }) => {
      await page.on("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: "view" }).click();
      await page.getByRole("button", { name: "DELETE" }).click();

      const notification = await page.locator(".notification");
      await expect(notification).toContainText("Old Blog deleted");
      await expect(notification).toHaveCSS("color", "rgb(0, 128, 0)");
    });
  });
});
