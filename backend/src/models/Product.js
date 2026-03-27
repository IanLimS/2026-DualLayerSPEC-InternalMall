const { query: dbQuery, get, run } = require('../config/database');
const Category = require('./Category');

class Product {
  /**
   * huo qu suo youProduct
   * @param {Object} options Queryxuan xiang
   * @param {number} options.page ye ma
   * @param {number} options.limit mei ye shu liang
   * @param {number} options.category CategoryID
   * @param {string} options.sort Sortfang shi
   * @param {string} options.keyword Searchguan jian ci
   * @param {string} options.status ProductStatus
   * @returns {Promise<Object>} ProductListhePaginationInfo
   */
  static async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      category = null,
      sort = 'created_desc',
      keyword = '',
      status = null
    } = options;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let params = [];

    // gou jianWHEREtiao jian
    whereConditions.push('p.deleted_at IS NULL');
    
    if (status) {
      whereConditions.push('p.status = ?');
      params.push(status);
    }

    if (category) {
      whereConditions.push('p.category_id = ?');
      params.push(category);
    }

    if (keyword) {
      whereConditions.push('(p.name LIKE ? OR p.description LIKE ?)');
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ') 
      : '';

    // gou jianORDER BYzi ju
    let orderClause = 'ORDER BY ';
    switch (sort) {
      case 'points_asc':
        orderClause += 'p.points_required ASC';
        break;
      case 'points_desc':
        orderClause += 'p.points_required DESC';
        break;
      case 'created_asc':
        orderClause += 'p.created_at ASC';
        break;
      case 'created_desc':
      default:
        orderClause += 'p.created_at DESC';
        break;
    }

    // QueryProductList
    const productsQuery = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.points_required,
        p.stock,
        p.warning_stock,
        p.images,
        p.status,
        p.category_id,
        p.sales,
        p.views,
        p.favorites,
        p.exchange_rules,
        p.specifications,
        p.sort,
        p.created_at,
        p.updated_at,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ${orderClause}
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);
    const products = await dbQuery(productsQuery, params);

    // Queryzong shu
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products p
      ${whereClause}
    `;

    const countParams = params.slice(0, -2); // yi chulimitheoffsetcan shu
    const countResult = await get(countQuery, countParams);
    const total = countResult.total;

    // chu li tu pian he gui geJSONzi duan
    products.forEach(product => {
      try {
        product.images = product.images ? JSON.parse(product.images) : [];
        product.specifications = product.specifications ? JSON.parse(product.specifications) : {};
      } catch (error) {
        product.images = [];
        product.specifications = {};
      }
    });

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * gen juIDhuo quProduct
   * @param {number} id ProductID
   * @returns {Promise<Object|null>} ProductInfo
   */
  static async getById(id) {
    const query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.points_required,
        p.stock,
        p.warning_stock,
        p.images,
        p.status,
        p.category_id,
        p.sales,
        p.views,
        p.favorites,
        p.exchange_rules,
        p.specifications,
        p.sort,
        p.created_at,
        p.updated_at,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? AND p.deleted_at IS NULL
    `;

    const product = await get(query, [id]);
    if (!product) return null;

    // chu li tu pian he gui geJSONzi duan
    try {
      product.images = product.images ? JSON.parse(product.images) : [];
      product.specifications = product.specifications ? JSON.parse(product.specifications) : {};
    } catch (error) {
      product.images = [];
      product.specifications = {};
    }

    return product;
  }

  /**
   * CreateProduct
   * @param {Object} productData Productshu ju
   * @returns {Promise<Object>} CreatedeProductInfo
   */
  static async create(productData) {
    const {
      name,
      description,
      price,
      pointsRequired,
      stock = 0,
      warningStock = 10,
      images = [],
      categoryId,
      specifications = {},
      exchangeRules = '',
      sort = 0
    } = productData;

    const imagesJson = JSON.stringify(images);
    const specificationsJson = JSON.stringify(specifications);

    const query = `
      INSERT INTO products (
        name, description, price, points_required, stock, warning_stock,
        images, category_id, specifications, exchange_rules, sort, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `;

    const result = await run(query, [
      name, description, price, pointsRequired, stock, warningStock,
      imagesJson, categoryId, specificationsJson, exchangeRules, sort
    ]);

    return await this.getById(result.lastID);
  }

  /**
   * UpdateProduct
   * @param {number} id ProductID
   * @param {Object} productData Productshu ju
   * @returns {Promise<Object|null>} Updatehou deProductInfo
   */
  static async update(id, productData) {
    const {
      name,
      description,
      price,
      pointsRequired,
      stock,
      warningStock,
      images,
      status,
      categoryId,
      specifications,
      exchangeRules,
      sort
    } = productData;

    const existingProduct = await this.getById(id);
    if (!existingProduct) return null;

    const updates = [];
    const params = [];

    // gou jianUpdatezi duan
    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      params.push(price);
    }
    if (pointsRequired !== undefined) {
      updates.push('points_required = ?');
      params.push(pointsRequired);
    }
    if (stock !== undefined) {
      updates.push('stock = ?');
      params.push(stock);
    }
    if (warningStock !== undefined) {
      updates.push('warning_stock = ?');
      params.push(warningStock);
    }
    if (images !== undefined) {
      updates.push('images = ?');
      params.push(JSON.stringify(images));
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (categoryId !== undefined) {
      updates.push('category_id = ?');
      params.push(categoryId);
    }
    if (specifications !== undefined) {
      updates.push('specifications = ?');
      params.push(JSON.stringify(specifications));
    }
    if (exchangeRules !== undefined) {
      updates.push('exchange_rules = ?');
      params.push(exchangeRules);
    }
    if (sort !== undefined) {
      updates.push('sort = ?');
      params.push(sort);
    }

    if (updates.length === 0) return existingProduct;

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const updateQuery = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
    await run(updateQuery, params);

    return await this.getById(id);
  }

  /**
   * DeleteProduct（ruanDelete）
   * @param {number} id ProductID
   * @returns {Promise<boolean>} shi fouDeleteSucceeded
   */
  static async delete(id) {
    const deleteQuery = 'UPDATE products SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await run(deleteQuery, [id]);
    return result.changes > 0;
  }

  /**
   * UpdateProductStock
   * @param {number} id ProductID
   * @param {number} quantity bian hua shu liang（zheng shu zeng jia，fu shu jian shao）
   * @returns {Promise<Object|null>} Updatehou deProductInfo
   */
  static async updateStock(id, quantity) {
    const product = await this.getById(id);
    if (!product) return null;

    const newStock = product.stock + quantity;
    if (newStock < 0) throw new Error('Insufficient stock');

    const updateStockQuery = `
      UPDATE products 
      SET stock = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    
    await run(updateStockQuery, [newStock, id]);
    return await this.getById(id);
  }

  /**
   * zeng jiaProductxiao liang
   * @param {number} id ProductID
   * @param {number} quantity xiao liang shu liang
   * @returns {Promise<boolean>} shi fouUpdateSucceeded
   */
  static async increaseSales(id, quantity) {
    const salesQuery = `
      UPDATE products 
      SET sales = sales + ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    
    const result = await run(salesQuery, [quantity, id]);
    return result.changes > 0;
  }

  /**
   * huo quLow stock warningProduct
   * @returns {Promise<Array>} Insufficient stockdeProductList
   */
  static async getLowStockProducts() {
    const query = `
      SELECT 
        p.id,
        p.name,
        p.stock,
        p.warning_stock,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.stock <= p.warning_stock AND p.status = 'active' AND p.deleted_at IS NULL
      ORDER BY p.stock ASC
    `;

    return await query(query);
  }

  /**
   * huo quTop sellingProduct
   * @param {number} limit fan hui shu liang xian zhi
   * @returns {Promise<Array>} Top sellingProductList
   */
  static async getTopSellingProducts(limit = 10) {
    const topSellingQuery = `
      SELECT 
        p.id,
        p.name,
        p.points_required,
        p.sales,
        p.images,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'active' AND p.deleted_at IS NULL
      ORDER BY p.sales DESC
      LIMIT ?
    `;

    const products = await query(topSellingQuery, [limit]);
    
    // chu li tu pianJSONzi duan
    products.forEach(product => {
      try {
        product.images = product.images ? JSON.parse(product.images) : [];
        // xiang hou jian rong：ru guo mei you tu pian shu zu dan you dan ge tu pian，zeCreatebao han dan ge tu pian de shu zu
        if (product.images.length === 0 && product.image) {
          product.images = [product.image];
        }
      } catch (error) {
        product.images = [];
      }
    });

    return products;
  }
}

module.exports = Product;