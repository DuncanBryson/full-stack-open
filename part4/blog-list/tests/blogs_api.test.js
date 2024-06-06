const supertest = require("supertest");
const { test, after, beforeEach, describe } = require("node:test");
const Blog = require("../models/blog");
const assert = require("assert");
const app = require("../app");
const mongoose = require("mongoose");
const api = supertest(app);
const helper = require("./test_helper");
const logger = require("../utils/logger");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});
describe("Getting Blogs functioning", () => {
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

describe("Posting blogs functioning", () => {
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

describe("Deleting blogs functioning", () => {
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
after(async () => {
  await mongoose.connection.close();
});
