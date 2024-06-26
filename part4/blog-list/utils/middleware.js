const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const errorHandler = (error, request, response, next) => {
  logger.error("handler called", error.message);
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted ID" });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response.status(400).json({ error: "Username is not unique" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }
  next(error);
};

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const tokenExtractor = (request, response, next) => {
  const auth = request.get("Authorization");
  if (auth && auth.startsWith("Bearer ")) {
    request.token = auth.replace("Bearer ", "");
  } else request.token = null;
  next();
};

const userExtractor = async (request, response, next) => {
  const verifiedToken = jwt.verify(request.token, process.env.SECRET);
  const user = await User.findById(verifiedToken.id);
  if (!user) {
    request.user = null;
    response.status(401).json({ error: "User not found" });
  } else request.user = user;
  next();
};

module.exports = {
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
};
