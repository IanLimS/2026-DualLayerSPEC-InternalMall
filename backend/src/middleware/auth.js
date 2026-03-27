const jwt = require('jsonwebtoken');
const config = require('../config/app');

// JWT ren zheng zhong jian jian
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'fang wen ling pai que shi'
    });
  }

  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'ling paiInvalidhuo yiExpired'
      });
    }

    req.user = user;
    next();
  });
};

// Adminquan xian zhong jian jian
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'xu yaoAdminquan xian'
    });
  }
  next();
};

// Userquan xian zhong jian jian
const requireUser = (req, res, next) => {
  if (req.user.role !== 'user' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'xu yaoUserquan xian'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireUser
};