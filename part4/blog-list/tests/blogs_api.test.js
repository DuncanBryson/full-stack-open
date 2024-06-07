const supertest = require("supertest");
const { test, after, beforeEach, describe } = require("node:test");
const Blog = require("../models/blog");
const assert = require("assert");
const app = require("../app");
const mongoose = require("mongoose");
const api = supertest(app);
const helper = require("./test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});
describe("Getting Blogs", () => {
  test("blogs are JSON", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    assert.strictEqual(response.body.length, 2);
  });

  test("GET correct number of blogs", async () => {
    await api.get("/api/blogs");
  });

  test("returning id not _id", async () => {
    const blogs = await helper.blogsInDb();
    const ids = blogs.map((b) => b.id.length);
    assert.deepStrictEqual(ids, [24, 24]);
  });
});

describe("Posting blogs", () => {
  test("Post adds new blog", async () => {
    const newBlog = {
      title: "Why you need TDD",
      author: "NPM Test",
      url: "fullstackopen.com",
      likes: 2346,
    };
    await api.post("/api/blogs").send(newBlog).expect(201);
    const updatedBlogs = await helper.blogsInDb();
    assert.strictEqual(updatedBlogs.length, helper.initialBlogs.length + 1);
  });

  test("Missing likes defaults to 0", async () => {
    const newBlog = {
      title: "Why you need TDD",
      author: "NPM Test",
      url: "fullstackopen.com",
    };
    const response = await api.post("/api/blogs").send(newBlog);
    assert.strictEqual(response.body.likes, 0);
  });

  test("Missing title gives 400", async () => {
    const newBlog = {
      author: "NPM Test",
      url: "fullstackopen.com",
    };
    await api.post("/api/blogs").send(newBlog).expect(400);
  });

  test("Missing URL gives 400", async () => {
    const newBlog = {
      title: "Why you need TDD",
      author: "NPM Test",
    };
    await api.post("/api/blogs").send(newBlog).expect(400);
  });
});

describe("Deleting blogs", () => {
  test("Delete non-existing blog", async () => {
    const id = await helper.getVoidID();
    await api.delete(`/api/blogs/${id}`).expect(204);
  });
  test("Delete blog working", async () => {
    const initialBlogs = await helper.blogsInDb();
    const id = initialBlogs[0].id;
    await api.delete(`/api/blogs/${id}`).expect(204);
    const finalBlogs = await helper.blogsInDb();
    assert.strictEqual(finalBlogs.length, initialBlogs.length - 1);
  });
});

describe("Updating blogs", () => {
  test("Update blog", async () => {
    const initialBlogs = await helper.blogsInDb();
    const id = initialBlogs[1].id;
    const updatedBlog = {
      title: "The new best search engine",
      author: "Macrohard",
      url: "Bingchilling.com",
      likes: 10000,
    };
    await api
      .put(`/api/blogs/${id}`)
      .send(updatedBlog)
      .expect(200)
      .expect("Content-type", /application\/json/);
    updatedBlog.id = id;
    const updatedBloglist = await helper.blogsInDb();
    assert.deepStrictEqual(updatedBlog, updatedBloglist[1]);
  });
  test("Missing url"),
    async () => {
      const initialBlogs = await helper.blogsInDb();
      const id = initialBlogs[1].id;
      const updatedBlog = {
        title: "The new best search engine",
        author: "Macrohard",
        likes: 1,
      };
      await api.put(`/api/blogs/${id}`).send(updatedBlog).expect(400);
    };
  test("Missing title"),
    async () => {
      const initialBlogs = await helper.blogsInDb();
      const id = initialBlogs[1].id;
      const updatedBlog = {
        author: "Macrohard",
        url: "Bingchilling.com",
        likes: 100000,
      };
      await api.put(`/api/blogs/${id}`).send(updatedBlog).expect(400);
    };
  test("only update likes", async () => {
    const initialBlogs = await helper.blogsInDb();
    const id = initialBlogs[1].id;
    const updatedBlog = {
      likes: 9999,
    };
    await api
      .put(`/api/blogs/${id}`)
      .send(updatedBlog)
      .expect(200)
      .expect("Content-type", /application\/json/);
    const updatedBloglist = await helper.blogsInDb();
    assert.deepStrictEqual(updatedBlog.likes, updatedBloglist[1].likes);
  });
  test("update non-existent ID", async () => {
    const id = helper.getVoidID();
    const updatedBlog = {
      title: "The new best search engine",
      author: "Macrohard",
      url: "Bingchilling.com",
      likes: 10000,
    };
    await api.put(`/api/blogs/${id}`).send(updatedBlog).expect(400);
  });
  test("update invalid ID", async () => {
    const id = 3458596;
    const updatedBlog = {
      title: "The new best search engine",
      author: "Macrohard",
      url: "Bingchilling.com",
      likes: 10000,
    };
    await api.put(`/api/blogs/${id}`).send(updatedBlog).expect(400);
  });
});

after(async () => {
  await mongoose.connection.close();
});
