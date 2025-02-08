const { z } = require("zod");

const errorHandler = (err, req, res, next) => {
  if (err instanceof z.ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path[0],
      message: e.message,
    }));

    return res.status(400).json({ errors: formattedErrors });
  }
  const statusCode = err.statusCode || 500;

  console.error(`[ERROR] ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    details: err.details || null,
  });
};

module.exports = errorHandler;
