const config = require("./utils/config");
const express = require("express");
const app = express();
require("express-async-errors");
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const userRouter = require("./controllers/users");
const blogRouter = require("./controllers/blogs");
const loginRouter = require("./controllers/login");
const middleware = require("./utils/middleware");

const mongoUrl = config.MONGODB_URI;
mongoose
  .connect(mongoUrl)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((err) => {
    logger.error("Error connecting to MongoDB", err.message);
  });
app.use(cors());
app.use(express.json());

app.use(middleware.tokenExtractor);
app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
