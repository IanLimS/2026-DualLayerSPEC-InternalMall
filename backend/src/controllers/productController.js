const ProductService = require('../services/productService');
const { successResponse, errorResponse } = require('../utils/response');

class ProductController {
  /**
   * huo quProductList
   */
  static async getProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        sort = 'created_desc',
        status = 'active'
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        category,
        sort,
        status
      };

      const result = await ProductService.getProducts(options);

      // huo quCategoryListyong yuFilter
      const categories = await ProductService.getCategories({ status: 'active' });
      
      // ji suan mei geCategorydeProductshu liang
      const categoriesWithCount = await ProductService.getCategoriesWithProductCount();

      return successResponse(res, {
        ...result,
        filters: {
          categories: categoriesWithCount.map(cat => ({
            id: cat.id,
            name: cat.name,
            count: cat.product_count
          }))
        }
      });
    } catch (error) {
      console.error('huo quProductListFailed:', error);
      return errorResponse(res, 'SYS_001', 'huo quProductListFailed', error.message);
    }
  }

  /**
   * SearchProduct
   */
  static async searchProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        keyword,
        category,
        sort = 'created_desc',
        status = 'active',
        minPoints,
        maxPoints
      } = req.query;

      const searchOptions = {
        keyword,
        category,
        minPoints: minPoints ? parseInt(minPoints) : undefined,
        maxPoints: maxPoints ? parseInt(maxPoints) : undefined,
        sortBy: sort,
        page: parseInt(page),
        limit: parseInt(limit),
        status
      };

      const result = await ProductService.searchProducts(searchOptions);

      // huo quCategoryListyong yuFilter
      const categories = await ProductService.getCategories({ status: 'active' });
      
      // ji suan mei geCategorydeProductshu liang
      const categoriesWithCount = await ProductService.getCategoriesWithProductCount();

      return successResponse(res, {
        ...result,
        filters: {
          categories: categoriesWithCount.map(cat => ({
            id: cat.id,
            name: cat.name,
            count: cat.product_count
          }))
        }
      });
    } catch (error) {
      console.error('SearchProductFailed:', error);
      return errorResponse(res, 'SYS_001', 'SearchProductFailed', error.message);
    }
  }

  /**
   * huo quProduct Detail
   */
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user ? req.user.id : null;
      
      const product = await ProductService.getProductById(id, userId);
      
      if (!product) {
        return errorResponse(res, 'PROD_001', 'Product not found');
      }

      return successResponse(res, product);
    } catch (error) {
      console.error('huo quProduct DetailFailed:', error);
      return errorResponse(res, 'SYS_001', 'huo quProduct DetailFailed', error.message);
    }
  }

  /**
   * huo quProductCategory
   */
  static async getCategories(req, res) {
    try {
      const { status = 'active' } = req.query;
      const categories = await ProductService.getCategories({ status });
      
      return successResponse(res, categories);
    } catch (error) {
      console.error('huo quProductCategoryFailed:', error);
      return errorResponse(res, 'SYS_001', 'huo quProductCategoryFailed', error.message);
    }
  }

  /**
   * tian jia/qu xiaoProductFavorites
   */
  static async toggleFavorite(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // TODO: shi xianFavoritesluo ji
      // zhe li xu yaoCreateyi geFavoritemo xing lai chu liFavoritesgong neng
      
      return successResponse(res, null, 'cao zuoSucceeded');
    } catch (error) {
      console.error('ProductFavoritescao zuoFailed:', error);
      return errorResponse(res, 'SYS_001', 'ProductFavoritescao zuoFailed', error.message);
    }
  }

  /**
   * huo quUserFavoritesProduct
   */
  static async getFavorites(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.user.id;
      
      // TODO: shi xian huo quFavoritesProductluo ji
      // zhe li xu yaoCreateyi geFavoritemo xing lai chu liFavoritesgong neng
      
      return successResponse(res, {
        products: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages: 0
        }
      });
    } catch (error) {
      console.error('huo quFavoritesProductFailed:', error);
      return errorResponse(res, 'SYS_001', 'huo quFavoritesProductFailed', error.message);
    }
  }
}

module.exports = ProductController;