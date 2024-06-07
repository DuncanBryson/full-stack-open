const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");
require("dotenv").config();

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;
  const getUser = await User.findOne({ username });
  const passwordValidation =
    getUser === null
      ? false
      : await bcrypt.compare(password, getUser.passwordHash);

  if (!(getUser && passwordValidation)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }
  const user = {
    username: getUser.username,
    id: getUser._id,
  };

  const token = jwt.sign(user, process.env.SECRET, {
    expiresIn: 10 * 60,
  });
  response
    .status(200)
    .send({ token, username: getUser.username, name: getUser.name });
});

module.exports = loginRouter;
