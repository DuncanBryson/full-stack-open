const { test, expect, beforeEach, describe } = require("@playwright/test");
const { login, addBlog, getToken } = require("./helper");

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
  });

  test("Login form is shown", async ({ page }) => {
    await page.goto("http://localhost:5173");
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
    test("only original poster can see DELETE", async ({ page, request }) => {
      await request.post("/api/users", {
        data: {
          name: "newtester",
          username: "newtester",
          password: "sekurity",
        },
      });
      await page.getByRole("button", { name: "Logout" }).click();
      await login(page, "newtester", "sekurity");
      await page.getByRole("button", { name: "view" }).click();
      await expect(
        page.getByRole("button", { name: "DELETE" })
      ).not.toBeVisible();
    });
  });
  describe("Blogs with preexisting likes", () => {
    beforeEach(async ({ request, page }) => {
      const token = await getToken(request);
      await request.post("/api/blogs", {
        data: {
          title: "Second",
          author: "BlogAuthor",
          url: "https://www.notawebsite.com",
          likes: 9998,
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      await request.post("/api/blogs", {
        data: {
          title: "Most popular",
          author: "BlogAuthor",
          url: "https://www.notawebsite.com",
          likes: 9999,
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      await request.post("/api/blogs", {
        data: {
          title: "Third",
          author: "BlogAuthor",
          url: "https://www.notawebsite.com",
          likes: 10,
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      login(page, "test", "sekurity");
    });
    test("blogs are sorted by likes", async ({ page }) => {
      await page.getByText("Logged in as test").waitFor();
      // Most likes shows first
      const oldBlogs = await page.$$(".blog");
      expect(await oldBlogs[0].innerText()).toContain("Most popular");
      // Make second most liked into most liked
      await page.getByRole("button", { name: "view" }).nth(1).click();
      const likeButton = async (i) => {
        for (let j = 0; j < i; j++) {
          await page.getByRole("button", { name: "like" }).click();
        }
      };
      await likeButton(2);
      // Reload page and check that Second is now shown first
      await page.goto("http://localhost:5173");
      await page.getByText("Most popular").waitFor();
      let newBlogs = await page.$$(".blog");
      expect(await newBlogs[0].innerText()).toContain("Second");
    });
  });
});
