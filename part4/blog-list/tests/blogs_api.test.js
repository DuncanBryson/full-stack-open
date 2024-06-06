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

test("Post adds new blog", async () => {
  const newBlog = {
    title: "Why you need TDD",
    author: "NPM Test",
    URL: "fullstackopen.com",
    likes: 2346,
  };
  await api.post("/api/blogs").send(newBlog).expect(201);
  const updatedBlogs = await helper.blogsInDb();
  assert.strictEqual(updatedBlogs.length, helper.initialBlogs.length + 1);
});

after(async () => {
  await mongoose.connection.close();
});
