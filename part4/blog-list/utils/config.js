require("dotenv").config();
const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;
const MONGODB_URI =
  ENV === "test" ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

module.exports = { MONGODB_URI, PORT, ENV };
