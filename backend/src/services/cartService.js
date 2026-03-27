const Cart = require('../models/Cart');

class CartService {
  /**
   * huo quUserCartList
   * @param {number} userId - UserID
   * @returns {Promise<Object>} - CartListheStatisticsInfo
   */
  static async getCartItems(userId) {
    try {
      const cartItems = await Cart.getCartByUserId(userId);
      const pointsSummary = await Cart.getCartPointsSummary(userId);
      
      return {
        success: true,
        cartItems: cartItems,
        summary: pointsSummary
      };
    } catch (error) {
      console.error('huo quCartListFailed:', error);
      throw {
        success: false,
        message: 'huo quCartListFailed',
        error: error.message
      };
    }
  }

  /**
   * tian jiaProductdaoCart
   * @param {number} userId - UserID
   * @param {number} productId - ProductID
   * @param {number} quantity - shu liang
   * @returns {Promise<Object>} - cao zuo jie guo
   */
  static async addToCart(userId, productId, quantity) {
    try {
      if (!productId || !quantity || quantity <= 0) {
        throw new Error('ProductIDhe shu liang bi xu wei zheng zheng shu');
      }

      const result = await Cart.addToCart(userId, productId, quantity);
      
      // huo quUpdatehou deCartStatistics
      const summary = await Cart.getCartPointsSummary(userId);
      
      return {
        success: true,
        message: result.message,
        data: {
          cartId: result.cartId,
          quantity: result.quantity,
          summary
        }
      };
    } catch (error) {
      console.error('tian jiaProductdaoCartFailed:', error);
      return {
        success: false,
        message: error.message || 'tian jiaProductdaoCartFailed',
        error: error.message
      };
    }
  }

  /**
   * UpdateCartProductshu liang
   * @param {number} userId - UserID
   * @param {number} cartId - CartxiangID
   * @param {number} quantity - xin shu liang
   * @returns {Promise<Object>} - cao zuo jie guo
   */
  static async updateItemQuantity(userId, cartId, quantity) {
    try {
      if (!cartId || !quantity || quantity <= 0) {
        throw new Error('CartxiangIDhe shu liang bi xu wei zheng zheng shu');
      }

      const result = await Cart.updateQuantity(userId, cartId, quantity);
      
      // huo quUpdatehou deCartStatistics
      const summary = await Cart.getCartPointsSummary(userId);
      
      return {
        success: true,
        message: result.message,
        data: {
          quantity: result.quantity,
          summary
        }
      };
    } catch (error) {
      console.error('UpdateCartProductshu liangFailed:', error);
      return {
        success: false,
        message: error.message || 'UpdateCartProductshu liangFailed',
        error: error.message
      };
    }
  }

  /**
   * UpdateCartProductxuan zhongStatus
   * @param {number} userId - UserID
   * @param {number} cartId - CartxiangID
   * @param {boolean} isSelected - shi fou xuan zhong
   * @returns {Promise<Object>} - cao zuo jie guo
   */
  static async updateItemSelection(userId, cartId, isSelected) {
    try {
      if (!cartId) {
        throw new Error('CartxiangIDCannot be empty');
      }

      const result = await Cart.updateSelectedStatus(userId, cartId, isSelected);
      
      // huo quUpdatehou deCartStatistics
      const summary = await Cart.getCartPointsSummary(userId);
      
      return {
        success: true,
        message: result.message,
        data: {
          is_selected: result.is_selected,
          summary
        }
      };
    } catch (error) {
      console.error('UpdateCartProductxuan zhongStatusFailed:', error);
      return {
        success: false,
        message: error.message || 'UpdateCartProductxuan zhongStatusFailed',
        error: error.message
      };
    }
  }

  /**
   * BatchUpdateCartProductxuan zhongStatus
   * @param {number} userId - UserID
   * @param {Array<number>} cartIds - CartxiangIDshu zu
   * @param {boolean} isSelected - shi fou xuan zhong
   * @returns {Promise<Object>} - cao zuo jie guo
   */
  static async updateMultipleItemsSelection(userId, cartIds, isSelected) {
    try {
      if (!cartIds || !Array.isArray(cartIds)) {
        throw new Error('CartxiangIDshu zuCannot be empty');
      }

      const result = await Cart.updateMultipleSelectedStatus(userId, cartIds, isSelected);
      
      // huo quUpdatehou deCartStatistics
      const summary = await Cart.getCartPointsSummary(userId);
      
      return {
        success: true,
        message: result.message,
        data: {
          updatedCount: result.updatedCount,
          summary
        }
      };
    } catch (error) {
      console.error('BatchUpdateCartProductxuan zhongStatusFailed:', error);
      return {
        success: false,
        message: error.message || 'BatchUpdateCartProductxuan zhongStatusFailed',
        error: error.message
      };
    }
  }

  /**
   * DeleteCartProduct
   * @param {number} userId - UserID
   * @param {number} cartId - CartxiangID
   * @returns {Promise<Object>} - cao zuo jie guo
   */
  static async removeFromCart(userId, cartId) {
    try {
      if (!cartId) {
        throw new Error('CartxiangIDCannot be empty');
      }

      const result = await Cart.removeFromCart(userId, cartId);
      
      // huo quUpdatehou deCartStatistics
      const summary = await Cart.getCartPointsSummary(userId);
      
      return {
        success: true,
        message: result.message,
        data: {
          summary
        }
      };
    } catch (error) {
      console.error('DeleteCartProductFailed:', error);
      return {
        success: false,
        message: error.message || 'DeleteCartProductFailed',
        error: error.message
      };
    }
  }

  /**
   * BatchDeleteCartProduct
   * @param {number} userId - UserID
   * @param {Array<number>} cartIds - CartxiangIDshu zu
   * @returns {Promise<Object>} - cao zuo jie guo
   */
  static async batchRemoveFromCart(userId, cartIds) {
    try {
      if (!cartIds || !Array.isArray(cartIds)) {
        throw new Error('CartxiangIDshu zuCannot be empty');
      }

      const result = await Cart.batchRemoveFromCart(userId, cartIds);
      
      // huo quUpdatehou deCartStatistics
      const summary = await Cart.getCartPointsSummary(userId);
      
      return {
        success: true,
        message: result.message,
        data: {
          deletedCount: result.deletedCount,
          summary
        }
      };
    } catch (error) {
      console.error('BatchDeleteCartProductFailed:', error);
      return {
        success: false,
        message: error.message || 'BatchDeleteCartProductFailed',
        error: error.message
      };
    }
  }

  /**
   * qing kongCart
   * @param {number} userId - UserID
   * @returns {Promise<Object>} - cao zuo jie guo
   */
  static async clearCart(userId) {
    try {
      const result = await Cart.clearCart(userId);
      
      return {
        success: true,
        message: result.message,
        data: {
          deletedCount: result.deletedCount,
          summary: {
            selectedCount: 0,
            totalPoints: 0,
            totalQuantity: 0
          }
        }
      };
    } catch (error) {
      console.error('qing kongCartFailed:', error);
      return {
        success: false,
        message: error.message || 'qing kongCartFailed',
        error: error.message
      };
    }
  }

  /**
   * huo quCartStatisticsInfo
   * @param {number} userId - UserID
   * @returns {Promise<Object>} - StatisticsInfo
   */
  static async getCartSummary(userId) {
    try {
      const cartCount = await Cart.getCartCount(userId);
      const pointsSummary = await Cart.getCartPointsSummary(userId);
      
      return {
        success: true,
        data: {
          ...cartCount,
          ...pointsSummary
        }
      };
    } catch (error) {
      console.error('huo quCartStatisticsInfoFailed:', error);
      return {
        success: false,
        message: error.message || 'huo quCartStatisticsInfoFailed',
        error: error.message
      };
    }
  }

  /**
   * huo qu xuan zhong deCartProduct（yong yu xia dan）
   * @param {number} userId - UserID
   * @returns {Promise<Object>} - xuan zhong deCartProduct
   */
  static async getSelectedItems(userId) {
    try {
      const allCartItems = await Cart.getCartByUserId(userId);
      const selectedItems = allCartItems.filter(item => item.is_selected);
      
      if (selectedItems.length === 0) {
        throw new Error('mei you xuan zhong deProduct');
      }

      // ji suan zongPoints
      const totalPoints = selectedItems.reduce((sum, item) => {
        return sum + (item.quantity * item.points_required);
      }, 0);

      return {
        success: true,
        data: {
          items: selectedItems,
          totalPoints
        }
      };
    } catch (error) {
      console.error('huo qu xuan zhong deCartProductFailed:', error);
      return {
        success: false,
        message: error.message || 'huo qu xuan zhong deCartProductFailed',
        error: error.message
      };
    }
  }
}

module.exports = CartService;