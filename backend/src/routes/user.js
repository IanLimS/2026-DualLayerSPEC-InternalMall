const express = require('express');
const router = express.Router();
const { authenticateToken, requireUser } = require('../middleware/auth');
const { query } = require('../config/database');

// huo quUserInfo
router.get('/profile', authenticateToken, requireUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await query(
      'SELECT id, username, email, phone, points, role, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'huo quUserInfoFailed',
      error: error.message
    });
  }
});

// Testjie kou - huo quTestProductList
router.get('/test-products', authenticateToken, requireUser, async (req, res) => {
  try {
    // fan hui mo niProductshu ju yong yuTest
    const mockProducts = [
      {
        id: 1,
        name: 'TestProduct1',
        description: 'zhe shi yong yuTestdeProduct1',
        price: 10.00,
        pointsRequired: 50,
        stock: 100,
        image: '',
        status: 'active',
        category: 'Electronics'
      },
      {
        id: 2,
        name: 'TestProduct2',
        description: 'zhe shi yong yuTestdeProduct2',
        price: 20.00,
        pointsRequired: 100,
        stock: 50,
        image: '',
        status: 'active',
        category: 'Office Supplies'
      }
    ];
    
    res.status(200).json({
      success: true,
      data: {
        products: mockProducts,
        pagination: {
          page: 1,
          limit: 10,
          total: 2
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'huo quTestProductListFailed',
      error: error.message
    });
  }
});

module.exports = router;