const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const CartController = require('../controllers/cartController');

// huo quUserCartList
router.get('/', authenticateToken, CartController.getCart);

// tian jiaProductdaoCart
router.post('/', authenticateToken, CartController.addToCart);

// huo quCartStatisticsInfo
router.get('/summary', authenticateToken, CartController.getCartSummary);

// huo qu xuan zhong deCartProduct（yong yu xia dan）
router.get('/selected', authenticateToken, CartController.getSelectedItems);

// BatchUpdateCartProductxuan zhongStatus
router.put('/batch-update-selection', authenticateToken, CartController.updateMultipleSelectedStatus);

// BatchDeleteCartProduct
router.delete('/batch-remove', authenticateToken, CartController.batchRemoveFromCart);

// qing kongCart
router.delete('/clear', authenticateToken, CartController.clearCart);

// UpdateCartProductshu liang
router.put('/:cartId', authenticateToken, CartController.updateQuantity);

// UpdateCartProductxuan zhongStatus
router.put('/:cartId/selection', authenticateToken, CartController.updateSelectedStatus);

// DeleteCartProduct
router.delete('/:cartId', authenticateToken, CartController.removeFromCart);

module.exports = router;