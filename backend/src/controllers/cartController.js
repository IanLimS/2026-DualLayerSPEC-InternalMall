const CartService = require('../services/cartService');
const { successResponse, errorResponse } = require('../utils/response');

class CartController {
  /**
   * huo quUserCartList
   * @param {Object} req - qing qiu dui xiang
   * @param {Object} res - xiang ying dui xiang
   */
  static async getCart(req, res) {
    try {
      const userId = req.user.id;
      const result = await CartService.getCartItems(userId);
      
      if (result.success) {
        return successResponse(res, result.message || 'huo quCartSucceeded', {
          cartItems: result.cartItems,
          summary: result.summary
        });
      } else {
        return errorResponse(res, result.message, 'CART_001');
      }
    } catch (error) {
      console.error('huo quCartFailed:', error);
      return errorResponse(res, 'huo quCartFailed', 'SYS_001', error.message);
    }
  }

  /**
   * tian jiaProductdaoCart
   * @param {Object} req - qing qiu dui xiang
   * @param {Object} res - xiang ying dui xiang
   */
  static async addToCart(req, res) {
    try {
      const userId = req.user.id;
      const { productId, quantity = 1 } = req.body;
      
      if (!productId) {
        return errorResponse(res, 'ProductIDCannot be empty', 'CART_002');
      }
      
      if (!Number.isInteger(productId) || productId <= 0) {
        return errorResponse(res, 'ProductIDbi xu wei zheng zheng shu', 'CART_003');
      }
      
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return errorResponse(res, 'shu liang bi xu wei zheng zheng shu', 'CART_004');
      }
      
      const result = await CartService.addToCart(userId, productId, quantity);
      
      if (result.success) {
        return successResponse(res, result.message, result.data);
      } else {
        return errorResponse(res, result.message, 'CART_005');
      }
    } catch (error) {
      console.error('tian jiaProductdaoCartFailed:', error);
      return errorResponse(res, 'tian jiaProductdaoCartFailed', 'SYS_001', error.message);
    }
  }

  /**
   * UpdateCartProductshu liang
   * @param {Object} req - qing qiu dui xiang
   * @param {Object} res - xiang ying dui xiang
   */
  static async updateQuantity(req, res) {
    try {
      const userId = req.user.id;
      const { cartId } = req.params;
      const { quantity } = req.body;
      
      if (!cartId || !Number.isInteger(parseInt(cartId))) {
        return errorResponse(res, 'CartxiangIDbi xu wei zheng zheng shu', 'CART_006');
      }
      
      if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
        return errorResponse(res, 'shu liang bi xu wei zheng zheng shu', 'CART_007');
      }
      
      const result = await CartService.updateItemQuantity(userId, parseInt(cartId), quantity);
      
      if (result.success) {
        return successResponse(res, result.message, result.data);
      } else {
        return errorResponse(res, result.message, 'CART_008');
      }
    } catch (error) {
      console.error('UpdateCartProductshu liangFailed:', error);
      return errorResponse(res, 'UpdateCartProductshu liangFailed', 'SYS_001', error.message);
    }
  }

  /**
   * UpdateCartProductxuan zhongStatus
   * @param {Object} req - qing qiu dui xiang
   * @param {Object} res - xiang ying dui xiang
   */
  static async updateSelectedStatus(req, res) {
    try {
      const userId = req.user.id;
      const { cartId } = req.params;
      const { isSelected } = req.body;
      
      if (!cartId || !Number.isInteger(parseInt(cartId))) {
        return errorResponse(res, 'CartxiangIDbi xu wei zheng zheng shu', 'CART_009');
      }
      
      if (typeof isSelected !== 'boolean') {
        return errorResponse(res, 'xuan zhongStatusbi xu wei bu er zhi', 'CART_010');
      }
      
      const result = await CartService.updateItemSelection(userId, parseInt(cartId), isSelected);
      
      if (result.success) {
        return successResponse(res, result.message, result.data);
      } else {
        return errorResponse(res, result.message, 'CART_011');
      }
    } catch (error) {
      console.error('UpdateCartProductxuan zhongStatusFailed:', error);
      return errorResponse(res, 'UpdateCartProductxuan zhongStatusFailed', 'SYS_001', error.message);
    }
  }

  /**
   * BatchUpdateCartProductxuan zhongStatus
   * @param {Object} req - qing qiu dui xiang
   * @param {Object} res - xiang ying dui xiang
   */
  static async updateMultipleSelectedStatus(req, res) {
    try {
      const userId = req.user.id;
      const { cartIds, isSelected } = req.body;
      
      if (!Array.isArray(cartIds) || cartIds.length === 0) {
        return errorResponse(res, 'CartxiangIDshu zuCannot be empty', 'CART_012');
      }
      
      // yan zheng suo youIDdou shi zheng zheng shu
      for (const id of cartIds) {
        if (!Number.isInteger(parseInt(id))) {
          return errorResponse(res, 'CartxiangIDbi xu wei zheng zheng shu', 'CART_013');
        }
      }
      
      if (typeof isSelected !== 'boolean') {
        return errorResponse(res, 'xuan zhongStatusbi xu wei bu er zhi', 'CART_014');
      }
      
      // zhuan huan wei zheng shu shu zu
      const intCartIds = cartIds.map(id => parseInt(id));
      
      const result = await CartService.updateMultipleItemsSelection(userId, intCartIds, isSelected);
      
      if (result.success) {
        return successResponse(res, result.message, result.data);
      } else {
        return errorResponse(res, result.message, 'CART_015');
      }
    } catch (error) {
      console.error('BatchUpdateCartProductxuan zhongStatusFailed:', error);
      return errorResponse(res, 'BatchUpdateCartProductxuan zhongStatusFailed', 'SYS_001', error.message);
    }
  }

  /**
   * DeleteCartProduct
   * @param {Object} req - qing qiu dui xiang
   * @param {Object} res - xiang ying dui xiang
   */
  static async removeFromCart(req, res) {
    try {
      const userId = req.user.id;
      const { cartId } = req.params;
      
      if (!cartId || !Number.isInteger(parseInt(cartId))) {
        return errorResponse(res, 'CartxiangIDbi xu wei zheng zheng shu', 'CART_016');
      }
      
      const result = await CartService.removeFromCart(userId, parseInt(cartId));
      
      if (result.success) {
        return successResponse(res, result.message, result.data);
      } else {
        return errorResponse(res, result.message, 'CART_017');
      }
    } catch (error) {
      console.error('DeleteCartProductFailed:', error);
      return errorResponse(res, 'DeleteCartProductFailed', 'SYS_001', error.message);
    }
  }

  /**
   * BatchDeleteCartProduct
   * @param {Object} req - qing qiu dui xiang
   * @param {Object} res - xiang ying dui xiang
   */
  static async batchRemoveFromCart(req, res) {
    try {
      const userId = req.user.id;
      const { cartIds } = req.body;
      
      if (!Array.isArray(cartIds) || cartIds.length === 0) {
        return errorResponse(res, 'CartxiangIDshu zuCannot be empty', 'CART_018');
      }
      
      // yan zheng suo youIDdou shi zheng zheng shu
      for (const id of cartIds) {
        if (!Number.isInteger(parseInt(id))) {
          return errorResponse(res, 'CartxiangIDbi xu wei zheng zheng shu', 'CART_019');
        }
      }
      
      // zhuan huan wei zheng shu shu zu
      const intCartIds = cartIds.map(id => parseInt(id));
      
      const result = await CartService.batchRemoveFromCart(userId, intCartIds);
      
      if (result.success) {
        return successResponse(res, result.message, result.data);
      } else {
        return errorResponse(res, result.message, 'CART_020');
      }
    } catch (error) {
      console.error('BatchDeleteCartProductFailed:', error);
      return errorResponse(res, 'BatchDeleteCartProductFailed', 'SYS_001', error.message);
    }
  }

  /**
   * qing kongCart
   * @param {Object} req - qing qiu dui xiang
   * @param {Object} res - xiang ying dui xiang
   */
  static async clearCart(req, res) {
    try {
      const userId = req.user.id;
      
      const result = await CartService.clearCart(userId);
      
      if (result.success) {
        return successResponse(res, result.message, result.data);
      } else {
        return errorResponse(res, result.message, 'CART_021');
      }
    } catch (error) {
      console.error('qing kongCartFailed:', error);
      return errorResponse(res, 'qing kongCartFailed', 'SYS_001', error.message);
    }
  }

  /**
   * huo quCartStatisticsInfo
   * @param {Object} req - qing qiu dui xiang
   * @param {Object} res - xiang ying dui xiang
   */
  static async getCartSummary(req, res) {
    try {
      const userId = req.user.id;
      
      const result = await CartService.getCartSummary(userId);
      
      if (result.success) {
        return successResponse(res, 'huo quCartStatisticsInfoSucceeded', result.data);
      } else {
        return errorResponse(res, result.message, 'CART_022');
      }
    } catch (error) {
      console.error('huo quCartStatisticsInfoFailed:', error);
      return errorResponse(res, 'huo quCartStatisticsInfoFailed', 'SYS_001', error.message);
    }
  }

  /**
   * huo qu xuan zhong deCartProduct（yong yu xia dan）
   * @param {Object} req - qing qiu dui xiang
   * @param {Object} res - xiang ying dui xiang
   */
  static async getSelectedItems(req, res) {
    try {
      const userId = req.user.id;
      
      const result = await CartService.getSelectedItems(userId);
      
      if (result.success) {
        return successResponse(res, 'huo qu xuan zhongProductSucceeded', result.data);
      } else {
        return errorResponse(res, result.message, 'CART_023');
      }
    } catch (error) {
      console.error('huo qu xuan zhong deCartProductFailed:', error);
      return errorResponse(res, 'huo qu xuan zhong deCartProductFailed', 'SYS_001', error.message);
    }
  }
}

module.exports = CartController;