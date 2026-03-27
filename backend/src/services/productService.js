const Product = require('../models/Product');
const Category = require('../models/Category');
const { run } = require('../config/database');

class ProductService {
  /**
   * huo quProductList
   * @param {Object} options Queryxuan xiang
   * @returns {Promise<Object>} ProductListhePaginationInfo
   */
  static async getProducts(options = {}) {
    return await Product.getAll(options);
  }

  /**
   * huo quProduct Detail
   * @param {number} id ProductID
   * @param {number} userId UserID（ke xuan，yong yu ji lu liu lan liang）
   * @returns {Promise<Object|null>} Product Detail
   */
  static async getProductById(id, userId = null) {
    const product = await Product.getById(id);
    if (!product) return null;

    // ru guo ti gong leUserID，zeng jia liu lan liang
    if (userId) {
      await this.incrementViews(id);
    }

    return product;
  }

  /**
   * CreateProduct
   * @param {Object} productData Productshu ju
   * @returns {Promise<Object>} CreatedeProductInfo
   */
  static async createProduct(productData) {
    // yan zhengCategoryshi fou cun zai
    if (productData.categoryId) {
      const category = await Category.getById(productData.categoryId);
      if (!category) {
        throw new Error('ProductCategoryDoes not exist');
      }
    }

    return await Product.create(productData);
  }

  /**
   * UpdateProduct
   * @param {number} id ProductID
   * @param {Object} productData Productshu ju
   * @returns {Promise<Object|null>} Updatehou deProductInfo
   */
  static async updateProduct(id, productData) {
    // yan zhengProductshi fou cun zai
    const existingProduct = await Product.getById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // ru guoUpdateleCategory，yan zhengCategoryshi fou cun zai
    if (productData.categoryId && productData.categoryId !== existingProduct.category_id) {
      const category = await Category.getById(productData.categoryId);
      if (!category) {
        throw new Error('ProductCategoryDoes not exist');
      }
    }

    return await Product.update(id, productData);
  }

  /**
   * DeleteProduct
   * @param {number} id ProductID
   * @returns {Promise<boolean>} shi fouDeleteSucceeded
   */
  static async deleteProduct(id) {
    // yan zhengProductshi fou cun zai
    const product = await Product.getById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    return await Product.delete(id);
  }

  /**
   * UpdateProductStock
   * @param {number} id ProductID
   * @param {number} quantity bian hua shu liang
   * @returns {Promise<Object|null>} Updatehou deProductInfo
   */
  static async updateProductStock(id, quantity) {
    const product = await Product.updateStock(id, quantity);
    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  /**
   * zeng jiaProduct Browseliang
   * @param {number} id ProductID
   * @returns {Promise<boolean>} shi fouUpdateSucceeded
   */
  static async incrementViews(id) {
    // zhe li jian dan diUpdateliu lan liang，shi ji ying yong zhong ke neng xu yao kao lv qu zhong deng luo ji
    const query = `
      UPDATE products 
      SET views = views + 1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    
    const result = await run(query, [id]);
    return result.changes > 0;
  }

  /**
   * huo quProductCategoryList
   * @param {Object} options Queryxuan xiang
   * @returns {Promise<Array>} CategoryList
   */
  static async getCategories(options = {}) {
    return await Category.getAll(options);
  }

  /**
   * huo quCategoryji qiProductshu liang
   * @returns {Promise<Array>} CategoryList，bao han mei geCategorydeProductshu liang
   */
  static async getCategoriesWithProductCount() {
    return await Category.getWithProductCount();
  }

  /**
   * CreateProductCategory
   * @param {Object} categoryData Categoryshu ju
   * @returns {Promise<Object>} CreatedeCategoryInfo
   */
  static async createCategory(categoryData) {
    return await Category.create(categoryData);
  }

  /**
   * UpdateProductCategory
   * @param {number} id CategoryID
   * @param {Object} categoryData Categoryshu ju
   * @returns {Promise<Object|null>} Updatehou deCategoryInfo
   */
  static async updateCategory(id, categoryData) {
    return await Category.update(id, categoryData);
  }

  /**
   * DeleteProductCategory
   * @param {number} id CategoryID
   * @returns {Promise<boolean>} shi fouDeleteSucceeded
   */
  static async deleteCategory(id) {
    return await Category.delete(id);
  }

  /**
   * huo quLow stock warningProduct
   * @returns {Promise<Array>} Insufficient stockdeProductList
   */
  static async getLowStockProducts() {
    return await Product.getLowStockProducts();
  }

  /**
   * huo quTop sellingProduct
   * @param {number} limit fan hui shu liang xian zhi
   * @returns {Promise<Array>} Top sellingProductList
   */
  static async getTopSellingProducts(limit = 10) {
    return await Product.getTopSellingProducts(limit);
  }

  /**
   * SearchProduct
   * @param {Object} searchOptions Searchxuan xiang
   * @returns {Promise<Object>} Searchjie guo hePaginationInfo
   */
  static async searchProducts(searchOptions) {
    const { keyword, category, minPoints, maxPoints, sortBy, page = 1, limit = 10 } = searchOptions;
    
    const options = {
      page,
      limit,
      category,
      keyword,
      sort: sortBy || 'created_desc'
    };

    // huo quProductList
    const result = await Product.getAll(options);

    // ru guo youPointsfan wei guo lv，zai jie guo zhong jin yi bu guo lv
    if (minPoints !== undefined || maxPoints !== undefined) {
      result.products = result.products.filter(product => {
        if (minPoints !== undefined && product.points_required < minPoints) return false;
        if (maxPoints !== undefined && product.points_required > maxPoints) return false;
        return true;
      });
    }

    return result;
  }

  /**
   * BatchUpdateProductStatus
   * @param {Array} productIds ProductIDshu zu
   * @param {string} status ProductStatus
   * @returns {Promise<number>} UpdatedeProductshu liang
   */
  static async batchUpdateStatus(productIds, status) {
    if (!productIds || productIds.length === 0) return 0;

    const placeholders = productIds.map(() => '?').join(',');
    const query = `
      UPDATE products 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id IN (${placeholders})
    `;
    
    const result = await run(query, [status, ...productIds]);
    return result.changes;
  }

  /**
   * BatchDeleteProduct
   * @param {Array} productIds ProductIDshu zu
   * @returns {Promise<number>} DeletedeProductshu liang
   */
  static async batchDeleteProducts(productIds) {
    if (!productIds || productIds.length === 0) return 0;

    const placeholders = productIds.map(() => '?').join(',');
    const query = `
      UPDATE products 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id IN (${placeholders})
    `;
    
    const result = await run(query, productIds);
    return result.changes;
  }
}

module.exports = ProductService;