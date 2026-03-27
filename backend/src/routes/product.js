const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');

// ProductList - gong kai jie kou
router.get('/', ProductController.getProducts);

// ProductSearch - gong kai jie kou
router.get('/search', ProductController.searchProducts);

// ProductCategory - gong kai jie kou
router.get('/categories', ProductController.getCategories);

// UserFavoritesProduct - xu yaoLogin
router.get('/favorites', authenticateToken, ProductController.getFavorites);

// Product Detail - gong kai jie kou
router.get('/:id', ProductController.getProductById);

// tian jia/qu xiaoFavorites - xu yaoLogin
router.post('/:id/favorite', authenticateToken, ProductController.toggleFavorite);
router.delete('/:id/favorite', authenticateToken, ProductController.toggleFavorite);

module.exports = router;