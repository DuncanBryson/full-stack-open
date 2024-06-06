const supertest = require("supertest");
const { test, after, beforeEach } = require("node:test");
const Blog = require("../models/blog");
const assert = require("assert");
const app = require("../app");
const mongoose = require("mongoose");
const api = supertest(app);
const helper = require("./test_helper");
const { before } = require("lodash");

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

after(async () => {
  await mongoose.connection.close();
});
