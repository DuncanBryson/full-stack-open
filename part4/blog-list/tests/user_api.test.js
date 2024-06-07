const supertest = require("supertest");
const { test, after, beforeEach, describe } = require("node:test");
const User = require("../models/user");
const assert = require("assert");
const app = require("../app");
const mongoose = require("mongoose");
const api = supertest(app);
const helper = require("./test_helper");

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(helper.initialUsers);
});

describe("User generation", () => {
  test("Post new User", async () => {
    const user = {
      username: "Eunique",
      password: "CorrectHorseBatteryStaple",
      name: "Steve",
    };
    await api.post("/api/users").send(user).expect(201);
    const newUser = await User.find({});
    assert.strictEqual(user.username, newUser[2].username);
  });
  test("Username too short", async () => {
    const user = {
      username: "No",
      password: "CorrectHorseBatteryStaple",
      name: "Steve",
    };
    const result = await api.post("/api/users").send(user).expect(400);
    const users = await User.find({});
    assert.deepStrictEqual(users.length, helper.initialUsers.length);
    assert(
      result.body.error.includes("shorter than the minimum allowed length")
    );
  });
  test("Password too short", async () => {
    const user = {
      username: "Eunique",
      password: "No",
      name: "Steve",
    };
    const result = await api.post("/api/users").send(user).expect(400);
    const users = await User.find({});
    assert.deepStrictEqual(users.length, helper.initialUsers.length);
    assert(
      result.body.error.includes(
        "Must provide a password with at least three caracters"
      )
    );
  });
  test("No username", async () => {
    const user = {
      password: "CorrectHorseBatteryStaple",
      name: "Steve",
    };
    const result = await api.post("/api/users").send(user).expect(400);
    const users = await User.find({});
    assert.deepStrictEqual(users.length, helper.initialUsers.length);
    assert(result.body.error.includes("`username` is required"));
  });
  test("No password", async () => {
    const user = {
      username: "Eunique",
      name: "Steve",
    };
    const result = await api.post("/api/users").send(user).expect(400);
    const users = await User.find({});
    assert.deepStrictEqual(users.length, helper.initialUsers.length);
    assert(
      result.body.error.includes(
        "Must provide a password with at least three caracters"
      )
    );
  });
});

after(async () => {
  await mongoose.connection.close();
});
