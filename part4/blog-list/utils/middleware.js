const errorHandler = (error, request, response, next) => {
  if (error.name === "ValidationError") {
    console.log("Validation error caught");
    return response.status(400).json({ error: error.message });
  }
};

module.exports = { errorHandler };
