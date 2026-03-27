const { db } = require('../config/database');

class Cart {
  /**
   * huo quUserdeCartList
   * @param {number} userId - UserID
   * @returns {Promise<Array>} - CartProductList
   */
  static async getCartByUserId(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          c.id,
          c.user_id,
          c.product_id,
          c.quantity,
          c.is_selected,
          c.created_at,
          c.updated_at,
          p.name as product_name,
          p.description as product_description,
          p.price,
          p.points_required,
          p.stock,
          p.images,
          p.status as product_status,
          cat.name as category_name
        FROM cart c
        LEFT JOIN products p ON c.product_id = p.id
        LEFT JOIN categories cat ON p.category_id = cat.id
        WHERE c.user_id = ? AND p.status = 'active'
        ORDER BY c.created_at DESC
      `;
      
      db.all(sql, [userId], (err, rows) => {
        if (err) {
          console.error('huo quCartFailed:', err);
          return reject(err);
        }
        
        // chu li tu pian zi duan
        const cartItems = rows.map(item => {
          return {
            ...item,
            images: item.images ? JSON.parse(item.images) : [],
            is_selected: Boolean(item.is_selected)
          };
        });
        
        resolve(cartItems);
      });
    });
  }

  /**
   * tian jiaProductdaoCart
   * @param {number} userId - UserID
   * @param {number} productId - ProductID
   * @param {number} quantity - shu liang
   * @returns {Promise<Object>} - cao zuo jie guo
   */
  static async addToCart(userId, productId, quantity = 1) {
    return new Promise((resolve, reject) => {
      // shou xian jian chaProductshi fou cun zai qieStockchong zu
      const checkProductSql = `
        SELECT id, name, stock, status
        FROM products
        WHERE id = ? AND status = 'active'
      `;
      
      db.get(checkProductSql, [productId], (err, product) => {
        if (err) {
          console.error('jian chaProductFailed:', err);
          return reject(err);
        }
        
        if (!product) {
          return reject(new Error('Product not foundhuo yiUnpublish'));
        }
        
        if (product.stock < quantity) {
          return reject(new Error('ProductInsufficient stock'));
        }
        
        // jian chaCartzhong shi fou yi cun zai gaiProduct
        const checkCartSql = `
          SELECT id, quantity
          FROM cart
          WHERE user_id = ? AND product_id = ?
        `;
        
        db.get(checkCartSql, [userId, productId], (err, cartItem) => {
          if (err) {
            console.error('jian chaCartFailed:', err);
            return reject(err);
          }
          
          if (cartItem) {
            // Productyi cun zai，Updateshu liang
            const newQuantity = cartItem.quantity + quantity;
            
            if (product.stock < newQuantity) {
              return reject(new Error('ProductInsufficient stock'));
            }
            
            const updateSql = `
              UPDATE cart
              SET quantity = ?, is_selected = 1, updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `;
            
            db.run(updateSql, [newQuantity, cartItem.id], function(err) {
              if (err) {
                console.error('UpdateCartFailed:', err);
                return reject(err);
              }
              
              resolve({
                success: true,
                message: 'CartProductshu liangUpdateSucceeded',
                cartId: cartItem.id,
                quantity: newQuantity
              });
            });
          } else {
            // Product not found，cha ru xin ji lu
            const insertSql = `
              INSERT INTO cart (user_id, product_id, quantity, is_selected)
              VALUES (?, ?, ?, 1)
            `;
            
            db.run(insertSql, [userId, productId, quantity], function(err) {
              if (err) {
                console.error('tian jia daoCartFailed:', err);
                return reject(err);
              }
              
              resolve({
                success: true,
                message: 'Productyi tian jia daoCart',
                cartId: this.lastID,
                quantity: quantity
              });
            });
          }
        });
      });
    });
  }

  /**
   * UpdateCartProductshu liang
   * @param {number} userId - UserID
   * @param {number} cartId - CartxiangID
   * @param {number} quantity - xin shu liang
   * @returns {Promise<Object>} - cao zuo jie guo
   */
  static async updateQuantity(userId, cartId, quantity) {
    return new Promise((resolve, reject) => {
      if (quantity <= 0) {
        return reject(new Error('Productshu liang bi xu da yu0'));
      }
      
      // jian chaCartxiang shi fou shu yu dang qianUser
      const checkCartSql = `
        SELECT c.id, c.product_id, c.quantity, p.stock, p.status
        FROM cart c
        LEFT JOIN products p ON c.product_id = p.id
        WHERE c.id = ? AND c.user_id = ? AND p.status = 'active'
      `;
      
      db.get(checkCartSql, [cartId, userId], (err, cartItem) => {
        if (err) {
          console.error('jian chaCartFailed:', err);
          return reject(err);
        }
        
        if (!cartItem) {
          return reject(new Error('CartxiangDoes not exist'));
        }
        
        if (cartItem.stock < quantity) {
          return reject(new Error('ProductInsufficient stock'));
        }
        
        // Updateshu liang
        const updateSql = `
          UPDATE cart
          SET quantity = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ? AND user_id = ?
        `;
        
        db.run(updateSql, [quantity, cartId, userId], function(err) {
          if (err) {
            console.error('UpdateCartshu liangFailed:', err);
            return reject(err);
          }
          
          resolve({
            success: true,
            message: 'CartProductshu liangUpdateSucceeded',
            quantity: quantity
          });
        });
      });
    });
  }

  /**
   * UpdateCartProductxuan zhongStatus
   * @param {number} userId - UserID
   * @param {number} cartId - CartxiangID
   * @param {boolean} isSelected - shi fou xuan zhong
   * @returns {Promise<Object>} - cao zuo jie guo
   */
  static async updateSelectedStatus(userId, cartId, isSelected) {
    return new Promise((resolve, reject) => {
      const updateSql = `
        UPDATE cart
        SET is_selected = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `;
      
      db.run(updateSql, [isSelected ? 1 : 0, cartId, userId], function(err) {
        if (err) {
          console.error('UpdateCartxuan zhongStatusFailed:', err);
          return reject(err);
        }
        
        if (this.changes === 0) {
          return reject(new Error('CartxiangDoes not exist'));
        }
        
        resolve({
          success: true,
          message: 'CartProductStatusUpdateSucceeded',
          is_selected: isSelected
        });
      });
    });
  }

  /**
   * BatchUpdateCartProductxuan zhongStatus
   * @param {number} userId - UserID
   * @param {Array<number>} cartIds - CartxiangIDshu zu
   * @param {boolean} isSelected - shi fou xuan zhong
   * @returns {Promise<Object>} - cao zuo jie guo
   */
  static async updateMultipleSelectedStatus(userId, cartIds, isSelected) {
    return new Promise((resolve, reject) => {
      if (!cartIds || cartIds.length === 0) {
        return resolve({
          success: true,
          message: 'mei you xu yaoUpdatede xiang'
        });
      }
      
      const placeholders = cartIds.map(() => '?').join(',');
      const updateSql = `
        UPDATE cart
        SET is_selected = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND id IN (${placeholders})
      `;
      
      db.run(updateSql, [isSelected ? 1 : 0, userId, ...cartIds], function(err) {
        if (err) {
          console.error('BatchUpdateCartxuan zhongStatusFailed:', err);
          return reject(err);
        }
        
        resolve({
          success: true,
          message: `yiUpdate${this.changes}xiangCartProductStatus`,
          updatedCount: this.changes
        });
      });
    });
  }

  /**
   * DeleteCartxiang
   * @param {number} userId - UserID
   * @param {number} cartId - CartxiangID
   * @returns {Promise<Object>} - cao zuo jie guo
   */
  static async removeFromCart(userId, cartId) {
    return new Promise((resolve, reject) => {
      const deleteSql = `
        DELETE FROM cart
        WHERE id = ? AND user_id = ?
      `;
      
      db.run(deleteSql, [cartId, userId], function(err) {
        if (err) {
          console.error('DeleteCartxiangFailed:', err);
          return reject(err);
        }
        
        if (this.changes === 0) {
          return reject(new Error('CartxiangDoes not exist'));
        }
        
        resolve({
          success: true,
          message: 'CartProductDeleteSucceeded'
        });
      });
    });
  }

  /**
   * BatchDeleteCartxiang
   * @param {number} userId - UserID
   * @param {Array<number>} cartIds - CartxiangIDshu zu
   * @returns {Promise<Object>} - cao zuo jie guo
   */
  static async batchRemoveFromCart(userId, cartIds) {
    return new Promise((resolve, reject) => {
      if (!cartIds || cartIds.length === 0) {
        return resolve({
          success: true,
          message: 'mei you xu yaoDeletede xiang'
        });
      }
      
      const placeholders = cartIds.map(() => '?').join(',');
      const deleteSql = `
        DELETE FROM cart
        WHERE user_id = ? AND id IN (${placeholders})
      `;
      
      db.run(deleteSql, [userId, ...cartIds], function(err) {
        if (err) {
          console.error('BatchDeleteCartxiangFailed:', err);
          return reject(err);
        }
        
        resolve({
          success: true,
          message: `yiDelete${this.changes}xiangCartProduct`,
          deletedCount: this.changes
        });
      });
    });
  }

  /**
   * qing kongCart
   * @param {number} userId - UserID
   * @returns {Promise<Object>} - cao zuo jie guo
   */
  static async clearCart(userId) {
    return new Promise((resolve, reject) => {
      const deleteSql = `
        DELETE FROM cart
        WHERE user_id = ?
      `;
      
      db.run(deleteSql, [userId], function(err) {
        if (err) {
          console.error('qing kongCartFailed:', err);
          return reject(err);
        }
        
        resolve({
          success: true,
          message: 'Cartyi qing kong',
          deletedCount: this.changes
        });
      });
    });
  }

  /**
   * huo quCartxuan zhongProductdePointshe ji
   * @param {number} userId - UserID
   * @returns {Promise<Object>} - PointsStatisticsInfo
   */
  static async getCartPointsSummary(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as selected_count,
          SUM(c.quantity * p.points_required) as total_points,
          SUM(c.quantity) as total_quantity
        FROM cart c
        LEFT JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ? AND c.is_selected = 1 AND p.status = 'active'
      `;
      
      db.get(sql, [userId], (err, result) => {
        if (err) {
          console.error('huo quCartPointsStatisticsFailed:', err);
          return reject(err);
        }
        
        resolve({
          selectedCount: result.selected_count || 0,
          totalPoints: result.total_points || 0,
          totalQuantity: result.total_quantity || 0
        });
      });
    });
  }

  /**
   * huo quUserCartshu liangStatistics
   * @param {number} userId - UserID
   * @returns {Promise<Object>} - shu liangStatistics
   */
  static async getCartCount(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          COUNT(*) as total_count,
          SUM(CASE WHEN is_selected = 1 THEN 1 ELSE 0 END) as selected_count
        FROM cart
        WHERE user_id = ?
      `;
      
      db.get(sql, [userId], (err, result) => {
        if (err) {
          console.error('huo quCartshu liangStatisticsFailed:', err);
          return reject(err);
        }
        
        resolve({
          totalCount: result.total_count || 0,
          selectedCount: result.selected_count || 0
        });
      });
    });
  }
}

module.exports = Cart;