const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const AdminController = require('../controllers/adminController');
const { uploadSingle, uploadMultiple } = require('../utils/fileUpload');

// AdminLogin
router.post('/login', AdminController.login);

// huo quSystemStatus
router.get('/system-status', authenticateToken, requireAdmin, AdminController.getSystemStatus);

// Testjie kou - AdminConnectivityTest
router.get('/test', authenticateToken, requireAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Adminjie kouConnectivityTestSucceeded',
    admin: req.user.username,
    timestamp: new Date().toISOString()
  });
});

// Product Management
router.get('/products', authenticateToken, requireAdmin, AdminController.getProducts);
router.post('/products', authenticateToken, requireAdmin, AdminController.createProduct);
router.put('/products/:id', authenticateToken, requireAdmin, AdminController.updateProduct);
router.delete('/products/:id', authenticateToken, requireAdmin, AdminController.deleteProduct);
router.put('/products/batch-status', authenticateToken, requireAdmin, AdminController.batchUpdateProductStatus);
router.delete('/products/batch', authenticateToken, requireAdmin, AdminController.batchDeleteProducts);

// ProductStatusUpdate
router.put('/products/:id/status', authenticateToken, requireAdmin, AdminController.updateProductStatus);

// ProductStocktiao zheng
router.put('/products/:id/stock', authenticateToken, requireAdmin, AdminController.updateProductStock);

// Producttu pianUpload
router.post('/products/upload-image', authenticateToken, requireAdmin, uploadSingle, AdminController.uploadProductImage);
router.post('/products/upload-images', authenticateToken, requireAdmin, uploadMultiple(5), AdminController.uploadProductImages);

// Low stock warning
router.get('/products/low-stock', authenticateToken, requireAdmin, AdminController.getLowStockProducts);

// Top sellingProduct
router.get('/products/top-selling', authenticateToken, requireAdmin, AdminController.getTopSellingProducts);

// ProductCategoryguan li
router.get('/categories', authenticateToken, requireAdmin, AdminController.getCategories);
router.post('/categories', authenticateToken, requireAdmin, AdminController.createCategory);
router.put('/categories/:id', authenticateToken, requireAdmin, AdminController.updateCategory);
router.delete('/categories/:id', authenticateToken, requireAdmin, AdminController.deleteCategory);

module.exports = router;