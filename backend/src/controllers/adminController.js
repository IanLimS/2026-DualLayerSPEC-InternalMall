const ProductService = require('../services/productService');
const { successResponse, errorResponse } = require('../utils/response');
const { processUploadImages, deleteImage } = require('../utils/fileUpload');

class AdminController {
  /**
   * AdminLogin
   */
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      
      // TODO: shi xianAdminLoginluo ji
      // zhe li ying gai shi yongauthServicezhong de yan zheng fang fa
      
      return successResponse(res, {
        token: 'mock_admin_token',
        admin: {
          id: 4,
          username: 'admin',
          role: 'admin'
        },
        expiresIn: 3600
      }, 'AdminLoginSucceeded');
    } catch (error) {
      console.error('AdminLoginFailed:', error);
      return errorResponse(res, 'USER_001', 'UsernamehuoPasswordError', error.message);
    }
  }

  /**
   * huo quSystemStatus
   */
  static async getSystemStatus(req, res) {
    try {
      // TODO: shi xian huo quSystemStatusluo ji
      // cong ge ge biao zhong huo quStatisticsshu ju
      
      return successResponse(res, {
        status: 'healthy',
        version: '1.0.0',
        uptime: 86400,
        statistics: {
          users: {
            total: 100,
            active: 80,
            new: 5
          },
          products: {
            total: 50,
            active: 45,
            outOfStock: 5
          },
          orders: {
            total: 200,
            pending: 10,
            completed: 180,
            cancelled: 10
          },
          points: {
            totalIssued: 10000,
            totalSpent: 5000,
            currentBalance: 5000
          }
        },
        timestamp: new Date().toISOString()
      }, 'SystemStatuszheng chang');
    } catch (error) {
      console.error('huo quSystemStatusFailed:', error);
      return errorResponse(res, 'SYS_001', 'huo quSystemStatusFailed', error.message);
    }
  }

  /**
   * huo quAdminProductList
   */
  static async getProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        category
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        category
      };

      const result = await ProductService.getProducts(options);
      return successResponse(res, result);
    } catch (error) {
      console.error('huo quAdminProductListFailed:', error);
      return errorResponse(res, 'SYS_001', 'huo quProductListFailed', error.message);
    }
  }

  /**
   * CreateProduct
   */
  static async createProduct(req, res) {
    try {
      const productData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        pointsRequired: req.body.pointsRequired,
        stock: req.body.stock || 0,
        warningStock: req.body.warningStock || 10,
        images: req.body.images || [],
        categoryId: req.body.categoryId,
        specifications: req.body.specifications || {},
        exchangeRules: req.body.exchangeRules || '',
        sort: req.body.sort || 0
      };

      const product = await ProductService.createProduct(productData);
      return successResponse(res, product, 'ProductCreateSucceeded');
    } catch (error) {
      console.error('CreateProductFailed:', error);
      return errorResponse(res, 'SYS_001', 'CreateProductFailed', error.message);
    }
  }

  /**
   * UpdateProduct
   */
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      
      const productData = {};
      
      // zhiUpdateti gong de zi duan
      if (req.body.name !== undefined) productData.name = req.body.name;
      if (req.body.description !== undefined) productData.description = req.body.description;
      if (req.body.price !== undefined) productData.price = req.body.price;
      if (req.body.pointsRequired !== undefined) productData.pointsRequired = req.body.pointsRequired;
      if (req.body.stock !== undefined) productData.stock = req.body.stock;
      if (req.body.warningStock !== undefined) productData.warningStock = req.body.warningStock;
      if (req.body.images !== undefined) productData.images = req.body.images;
      if (req.body.status !== undefined) productData.status = req.body.status;
      if (req.body.categoryId !== undefined) productData.categoryId = req.body.categoryId;
      if (req.body.specifications !== undefined) productData.specifications = req.body.specifications;
      if (req.body.exchangeRules !== undefined) productData.exchangeRules = req.body.exchangeRules;
      if (req.body.sort !== undefined) productData.sort = req.body.sort;

      const product = await ProductService.updateProduct(id, productData);
      if (!product) {
        return errorResponse(res, 'PROD_001', 'Product not found');
      }

      return successResponse(res, product, 'ProductUpdateSucceeded');
    } catch (error) {
      console.error('UpdateProductFailed:', error);
      return errorResponse(res, 'SYS_001', 'UpdateProductFailed', error.message);
    }
  }

  /**
   * DeleteProduct
   */
  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      
      const success = await ProductService.deleteProduct(id);
      if (!success) {
        return errorResponse(res, 'PROD_001', 'Product not found');
      }

      return successResponse(res, null, 'ProductDeleteSucceeded');
    } catch (error) {
      console.error('DeleteProductFailed:', error);
      return errorResponse(res, 'SYS_001', 'DeleteProductFailed', error.message);
    }
  }

  /**
   * BatchUpdateProductStatus
   */
  static async batchUpdateProductStatus(req, res) {
    try {
      const { productIds, status } = req.body;
      
      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return errorResponse(res, 'SYS_001', 'qing xuan ze yao cao zuo deProduct');
      }

      const updatedCount = await ProductService.batchUpdateStatus(productIds, status);
      return successResponse(res, { updatedCount }, `SucceededUpdate${updatedCount}geProductdeStatus`);
    } catch (error) {
      console.error('BatchUpdateProductStatusFailed:', error);
      return errorResponse(res, 'SYS_001', 'BatchUpdateProductStatusFailed', error.message);
    }
  }

  /**
   * BatchDeleteProduct
   */
  static async batchDeleteProducts(req, res) {
    try {
      const { productIds } = req.body;
      
      if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
        return errorResponse(res, 'SYS_001', 'qing xuan ze yaoDeletedeProduct');
      }

      const deletedCount = await ProductService.batchDeleteProducts(productIds);
      return successResponse(res, { deletedCount }, `SucceededDelete${deletedCount}geProduct`);
    } catch (error) {
      console.error('BatchDeleteProductFailed:', error);
      return errorResponse(res, 'SYS_001', 'BatchDeleteProductFailed', error.message);
    }
  }

  /**
   * huo quProductCategory
   */
  static async getCategories(req, res) {
    try {
      const categories = await ProductService.getCategoriesWithProductCount();
      return successResponse(res, categories);
    } catch (error) {
      console.error('huo quProductCategoryFailed:', error);
      return errorResponse(res, 'SYS_001', 'huo quProductCategoryFailed', error.message);
    }
  }

  /**
   * CreateProductCategory
   */
  static async createCategory(req, res) {
    try {
      const categoryData = {
        name: req.body.name,
        description: req.body.description || '',
        icon: req.body.icon || '',
        sort: req.body.sort || 0
      };

      const category = await ProductService.createCategory(categoryData);
      return successResponse(res, category, 'CategoryCreateSucceeded');
    } catch (error) {
      console.error('CreateCategoryFailed:', error);
      return errorResponse(res, 'SYS_001', 'CreateCategoryFailed', error.message);
    }
  }

  /**
   * UpdateProductCategory
   */
  static async updateCategory(req, res) {
    try {
      const { id } = req.params;
      
      const categoryData = {};
      
      // zhiUpdateti gong de zi duan
      if (req.body.name !== undefined) categoryData.name = req.body.name;
      if (req.body.description !== undefined) categoryData.description = req.body.description;
      if (req.body.icon !== undefined) categoryData.icon = req.body.icon;
      if (req.body.status !== undefined) categoryData.status = req.body.status;
      if (req.body.sort !== undefined) categoryData.sort = req.body.sort;

      const category = await ProductService.updateCategory(id, categoryData);
      if (!category) {
        return errorResponse(res, 'SYS_001', 'CategoryDoes not exist');
      }

      return successResponse(res, category, 'CategoryUpdateSucceeded');
    } catch (error) {
      console.error('UpdateCategoryFailed:', error);
      return errorResponse(res, 'SYS_001', 'UpdateCategoryFailed', error.message);
    }
  }

  /**
   * DeleteProductCategory
   */
  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      
      const success = await ProductService.deleteCategory(id);
      if (!success) {
        return errorResponse(res, 'SYS_001', 'CategoryDoes not existhuo wu faDelete');
      }

      return successResponse(res, null, 'CategoryDeleteSucceeded');
    } catch (error) {
      console.error('DeleteCategoryFailed:', error);
      return errorResponse(res, 'SYS_001', 'DeleteCategoryFailed', error.message);
    }
  }

  /**
   * huo quLow stock warningProduct
   */
  static async getLowStockProducts(req, res) {
    try {
      const products = await ProductService.getLowStockProducts();
      return successResponse(res, products);
    } catch (error) {
      console.error('huo quLow stock warningProductFailed:', error);
      return errorResponse(res, 'SYS_001', 'huo quLow stock warningProductFailed', error.message);
    }
  }

  /**
   * huo quTop sellingProduct
   */
  static async getTopSellingProducts(req, res) {
    try {
      const { limit = 10 } = req.query;
      const products = await ProductService.getTopSellingProducts(parseInt(limit));
      return successResponse(res, products);
    } catch (error) {
      console.error('huo quTop sellingProductFailed:', error);
      return errorResponse(res, 'SYS_001', 'huo quTop sellingProductFailed', error.message);
    }
  }

  /**
   * Uploaddan geProducttu pian
   */
  static async uploadProductImage(req, res) {
    try {
      if (!req.file) {
        return errorResponse(res, 'SYS_001', 'qing xuan ze yaoUploadde tu pian');
      }

      // chu liUploadde tu pian
      const processedImages = await processUploadImages([req.file]);
      
      if (processedImages.length === 0) {
        return errorResponse(res, 'SYS_001', 'tu pianUploadFailed');
      }

      const uploadedImage = processedImages[0];
      
      return successResponse(res, {
        filename: uploadedImage.filename,
        url: uploadedImage.url,
        size: uploadedImage.size
      }, 'tu pianUploadSucceeded');
    } catch (error) {
      console.error('tu pianUploadFailed:', error);
      return errorResponse(res, 'SYS_001', 'tu pianUploadFailed', error.message);
    }
  }

  /**
   * Uploadduo geProducttu pian
   */
  static async uploadProductImages(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return errorResponse(res, 'SYS_001', 'qing xuan ze yaoUploadde tu pian');
      }

      // chu liUploadde tu pian
      const processedImages = await processUploadImages(req.files);
      
      // jian cha shi fou youUploadFailedde tu pian
      const failedImages = processedImages.filter(img => img.error);
      if (failedImages.length > 0) {
        console.error('bu fen tu pianUploadFailed:', failedImages);
      }
      
      // fan huiUploadSucceededde tu pian
      const successImages = processedImages.filter(img => !img.error);
      
      return successResponse(res, {
        images: successImages.map(img => ({
          filename: img.filename,
          url: img.url,
          size: img.size
        })),
        uploaded: successImages.length,
        failed: failedImages.length
      }, `SucceededUpload${successImages.length}zhang tu pian${failedImages.length > 0 ? `，${failedImages.length}zhangFailed` : ''}`);
    } catch (error) {
      console.error('tu pianUploadFailed:', error);
      return errorResponse(res, 'SYS_001', 'tu pianUploadFailed', error.message);
    }
  }

  /**
   * UpdateProductStatus（Publish/Unpublish）
   */
  static async updateProductStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // yan zhengStatuszhi
      if (!status || (status !== 'active' && status !== 'inactive')) {
        return errorResponse(res, 'SYS_001', 'InvaliddeStatuszhi');
      }
      
      const productData = { status };
      const product = await ProductService.updateProduct(id, productData);
      
      if (!product) {
        return errorResponse(res, 'PROD_001', 'Product not found');
      }
      
      return successResponse(res, product, `Product${status === 'active' ? 'Publish' : 'Unpublish'}Succeeded`);
    } catch (error) {
      console.error('UpdateProductStatusFailed:', error);
      return errorResponse(res, 'SYS_001', 'UpdateProductStatusFailed', error.message);
    }
  }

  /**
   * UpdateProductStock
   */
  static async updateProductStock(req, res) {
    try {
      const { id } = req.params;
      const { stock } = req.body;
      
      // yan zhengStockzhi
      if (stock < 0 || !Number.isInteger(stock)) {
        return errorResponse(res, 'SYS_001', 'Stockzhi bi xu shi fei fu zheng shu');
      }
      
      const productData = { stock };
      const product = await ProductService.updateProduct(id, productData);
      
      if (!product) {
        return errorResponse(res, 'PROD_001', 'Product not found');
      }
      
      return successResponse(res, product, 'StockUpdateSucceeded');
    } catch (error) {
      console.error('UpdateProductStockFailed:', error);
      return errorResponse(res, 'SYS_001', 'UpdateProductStockFailed', error.message);
    }
  }
}

module.exports = AdminController;