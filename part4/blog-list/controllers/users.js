const bcrypt = require("bcrypt");
const User = require("../models/user");
const userRouter = require("express").Router();

userRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  if (!password || password.length < 3) {
    return response
      .status(400)
      .json({ error: "Must provide a password with at least three caracters" });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({ username, name, passwordHash });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = userRouter;
