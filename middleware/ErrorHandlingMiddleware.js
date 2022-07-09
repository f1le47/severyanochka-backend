const ApiError = require('../errors/ApiError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      status: err.status,
    });
  }
  return res.status(500).json({ message: 'Непредвиденная ошибка!' });
};

module.exports = errorHandler;
