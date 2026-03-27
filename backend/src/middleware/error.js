// Errorchu li zhong jian jian
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // ji luErrorri zhi
  console.error(err);

  // Mongoose Errorchu li
  if (err.name === 'CastError') {
    const message = 'zi yuan wei zhao dao';
    error = { message, statusCode: 404 };
  }

  // Mongoose chong fu jian zhiError
  if (err.code === 11000) {
    const message = 'chong fu de zi duan zhi';
    error = { message, statusCode: 400 };
  }

  // Mongoose yan zhengError
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  // JWT Error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalidde ling pai';
    error = { message, statusCode: 401 };
  }

  // JWT ExpiredError
  if (err.name === 'TokenExpiredError') {
    const message = 'ling pai yiExpired';
    error = { message, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server error'
  });
};

module.exports = errorHandler;