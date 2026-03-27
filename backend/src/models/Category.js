const { query: dbQuery, get, run } = require('../config/database');

class Category {
  /**
   * huo qu suo youCategory
   * @param {Object} options Queryxuan xiang
   * @param {string} options.status CategoryStatus
   * @returns {Promise<Array>} CategoryList
   */
  static async getAll(options = {}) {
    const { status = 'active' } = options;
    
    let query = `
      SELECT 
        id, name, description, sort, icon, status, created_at, updated_at
      FROM categories
    `;
    
    let params = [];
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY sort ASC, created_at ASC';
    
    const categories = await dbQuery(query, params);
    return categories;
  }

  /**
   * gen juIDhuo quCategory
   * @param {number} id CategoryID
   * @returns {Promise<Object|null>} CategoryInfo
   */
  static async getById(id) {
    const query = `
      SELECT 
        id, name, description, sort, icon, status, created_at, updated_at
      FROM categories
      WHERE id = ? AND deleted_at IS NULL
    `;
    
    return await get(query, [id]);
  }

  /**
   * CreateCategory
   * @param {Object} categoryData Categoryshu ju
   * @returns {Promise<Object>} CreatedeCategoryInfo
   */
  static async create(categoryData) {
    const {
      name,
      description = '',
      icon = '',
      sort = 0
    } = categoryData;

    const query = `
      INSERT INTO categories (name, description, icon, sort, status)
      VALUES (?, ?, ?, ?, 'active')
    `;

    const result = await run(query, [name, description, icon, sort]);
    return await this.getById(result.lastID);
  }

  /**
   * UpdateCategory
   * @param {number} id CategoryID
   * @param {Object} categoryData Categoryshu ju
   * @returns {Promise<Object|null>} Updatehou deCategoryInfo
   */
  static async update(id, categoryData) {
    const {
      name,
      description,
      icon,
      status,
      sort
    } = categoryData;

    const existingCategory = await this.getById(id);
    if (!existingCategory) return null;

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
    if (icon !== undefined) {
      updates.push('icon = ?');
      params.push(icon);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (sort !== undefined) {
      updates.push('sort = ?');
      params.push(sort);
    }

    if (updates.length === 0) return existingCategory;

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const updateQuery = `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`;
    await run(updateQuery, params);

    return await this.getById(id);
  }

  /**
   * DeleteCategory（ruanDelete）
   * @param {number} id CategoryID
   * @returns {Promise<boolean>} shi fouDeleteSucceeded
   */
  static async delete(id) {
    // jian cha shi fou youProductshi yong gaiCategory
    const productCheckQuery = 'SELECT COUNT(*) as count FROM products WHERE category_id = ? AND deleted_at IS NULL';
    const productCheckResult = await get(productCheckQuery, [id]);
    
    if (productCheckResult.count > 0) {
      throw new Error('gaiCategoryxia cun zaiProduct，wu faDelete');
    }

    const deleteQuery = 'UPDATE categories SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?';
    const result = await run(deleteQuery, [id]);
    return result.changes > 0;
  }

  /**
   * huo quCategoryji qiProductshu liang
   * @returns {Promise<Array>} CategoryList，bao han mei geCategorydeProductshu liang
   */
  static async getWithProductCount() {
    const query = `
      SELECT 
        c.id,
        c.name,
        c.description,
        c.icon,
        c.sort,
        c.status,
        c.created_at,
        c.updated_at,
        COALESCE(p.product_count, 0) as product_count
      FROM categories c
      LEFT JOIN (
        SELECT category_id, COUNT(*) as product_count
        FROM products
        WHERE deleted_at IS NULL
        GROUP BY category_id
      ) p ON c.id = p.category_id
      WHERE c.deleted_at IS NULL
      ORDER BY c.sort ASC, c.created_at ASC
    `;

    return await dbQuery(query);
  }
}

module.exports = Category;