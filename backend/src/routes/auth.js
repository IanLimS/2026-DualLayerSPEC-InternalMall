const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const config = require('../config/app');
const { query } = require('../config/database');

// UserLogin
router.post('/login', [
  body('username').notEmpty().withMessage('UsernameCannot be empty'),
  body('password').notEmpty().withMessage('PasswordCannot be empty'),
  body('type').isIn(['user', 'admin']).withMessage('Userlei xing bi xu shiuserhuoadmin')
], async (req, res) => {
  try {
    // yan zheng qing qiu can shu
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'qing qiuInvalid parameters',
        errors: errors.array()
      });
    }

    const { username, password, type } = req.body;

    // QueryUser
    const user = await query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (user.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'UsernamehuoPasswordError'
      });
    }

    // yan zhengPassword
    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'UsernamehuoPasswordError'
      });
    }

    // jian chaUserlei xing shi fou pi pei
    if (user[0].role !== type) {
      return res.status(403).json({
        success: false,
        message: 'Userlei xing bu pi pei'
      });
    }

    // sheng chengJWTling pai
    const token = jwt.sign(
      { 
        id: user[0].id, 
        username: user[0].username, 
        role: user[0].role 
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.status(200).json({
      success: true,
      message: 'LoginSucceeded',
      token,
      userType: user[0].role,
      userId: user[0].id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'LoginFailed',
      error: error.message
    });
  }
});

// UserLogout
router.post('/logout', (req, res) => {
  // zaiJWTfang an zhong，fu wu duan bu xu yao zuo te shu chu li
  // ke hu duanDeletetokenji ke shi xianLogout
  res.status(200).json({
    success: true,
    message: 'LogoutSucceeded'
  });
});

module.exports = router;