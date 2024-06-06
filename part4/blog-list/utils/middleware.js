const logger = require("./logger");
const errorHandler = (error, request, response, next) => {
  logger.error("handler called", error.message);
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted ID" });
  }
  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

module.exports = { errorHandler, unknownEndpoint };
