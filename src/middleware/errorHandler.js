// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
