const axios = require('axios');
const { expect } = require('chai');

// APIji chuURL
const BASE_URL = 'http://localhost:3001/api';

// Testshu ju
let adminToken = null;
let testProductId = null;
let testCategoryId = null;

describe('AdminProduct ManagementAPITest', () => {
  // Testqian huo quAdmintoken
  before(async () => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/login`, {
        username: 'admin',
        password: 'admin123'
      });
      
      if (response.data.success) {
        adminToken = response.data.data.token;
        console.log('AdminLoginSucceeded，huo qutokenSucceeded');
      } else {
        console.error('AdminLoginFailed:', response.data.message);
      }
    } catch (error) {
      console.error('Loginqing qiuFailed:', error.message);
    }
  });

  // Testhuo quProductCategory
  it('ying gai neng gou huo quProductCategoryList', async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/categories`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      expect(response.status).to.equal(200);
      expect(response.data.success).to.be.true;
      expect(response.data.data).to.be.an('array');
      
      console.log('huo quCategoryListSucceeded，Categoryshu liang:', response.data.data.length);
      
      // bao cun di yi geCategoryIDyong yu hou xuTest
      if (response.data.data.length > 0) {
        testCategoryId = response.data.data[0].id;
      }
    } catch (error) {
      console.error('huo quCategoryListFailed:', error.response?.data || error.message);
      throw error;
    }
  });

  // TestCreateProductCategory
  it('ying gai neng gouCreateProductCategory', async () => {
    try {
      const newCategory = {
        name: 'TestCategory',
        description: 'zhe shi yi geTestCategory',
        sort: 99
      };

      const response = await axios.post(`${BASE_URL}/admin/categories`, newCategory, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      expect(response.status).to.equal(200);
      expect(response.data.success).to.be.true;
      expect(response.data.data).to.have.property('name', 'TestCategory');
      
      console.log('CreateCategorySucceeded:', response.data.data);
      
      // bao cun xinCreatedeCategoryIDyong yu hou xuTest
      testCategoryId = response.data.data.id;
    } catch (error) {
      console.error('CreateCategoryFailed:', error.response?.data || error.message);
      throw error;
    }
  });

  // Testhuo quProductList
  it('ying gai neng gou huo quProductList', async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/products`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      expect(response.status).to.equal(200);
      expect(response.data.success).to.be.true;
      expect(response.data.data).to.have.property('products');
      expect(response.data.data.products).to.be.an('array');
      
      console.log('huo quProductListSucceeded，Productshu liang:', response.data.data.products.length);
      
      // bao cun di yi geProductIDyong yu hou xuTest
      if (response.data.data.products.length > 0) {
        testProductId = response.data.data.products[0].id;
      }
    } catch (error) {
      console.error('huo quProductListFailed:', error.response?.data || error.message);
      throw error;
    }
  });

  // TestCreateProduct
  it('ying gai neng gouCreateProduct', async () => {
    try {
      const newProduct = {
        name: 'TestProduct',
        description: 'zhe shi yi geTestProduct',
        price: 199.99,
        pointsRequired: 50,
        stock: 100,
        categoryId: testCategoryId,
        specifications: {
          color: 'hong se',
          size: 'M'
        },
        exchangeRules: 'mei ren xian dui1ge'
      };

      const response = await axios.post(`${BASE_URL}/admin/products`, newProduct, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      expect(response.status).to.equal(200);
      expect(response.data.success).to.be.true;
      expect(response.data.data).to.have.property('name', 'TestProduct');
      
      console.log('CreateProductSucceeded:', response.data.data);
      
      // bao cun xinCreatedeProductIDyong yu hou xuTest
      testProductId = response.data.data.id;
    } catch (error) {
      console.error('CreateProductFailed:', error.response?.data || error.message);
      throw error;
    }
  });

  // TestUpdateProduct
  it('ying gai neng gouUpdateProduct', async () => {
    if (!testProductId) {
      console.log('tiao guoUpdateProductTest，mei you ke yong deProductID');
      return;
    }

    try {
      const updateData = {
        name: 'Updatehou deTestProduct',
        stock: 80,
        status: 'inactive'
      };

      const response = await axios.put(`${BASE_URL}/admin/products/${testProductId}`, updateData, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      expect(response.status).to.equal(200);
      expect(response.data.success).to.be.true;
      expect(response.data.data).to.have.property('name', 'Updatehou deTestProduct');
      expect(response.data.data).to.have.property('stock', 80);
      expect(response.data.data).to.have.property('status', 'inactive');
      
      console.log('UpdateProductSucceeded:', response.data.data);
    } catch (error) {
      console.error('UpdateProductFailed:', error.response?.data || error.message);
      throw error;
    }
  });

  // Testhuo quProduct Detail
  it('ying gai neng gou huo quProduct Detail', async () => {
    if (!testProductId) {
      console.log('tiao guo huo quProduct DetailTest，mei you ke yong deProductID');
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/admin/products/${testProductId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      expect(response.status).to.equal(200);
      expect(response.data.success).to.be.true;
      expect(response.data.data).to.have.property('id', testProductId);
      
      console.log('huo quProduct DetailSucceeded:', response.data.data);
    } catch (error) {
      console.error('huo quProduct DetailFailed:', error.response?.data || error.message);
      throw error;
    }
  });

  // Testhuo quLow stock warningProduct
  it('ying gai neng gou huo quLow stock warningProduct', async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/products/low-stock`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      expect(response.status).to.equal(200);
      expect(response.data.success).to.be.true;
      expect(response.data.data).to.be.an('array');
      
      console.log('huo quLow stock warningProductSucceeded，Productshu liang:', response.data.data.length);
    } catch (error) {
      console.error('huo quLow stock warningProductFailed:', error.response?.data || error.message);
      throw error;
    }
  });

  // Testhuo quTop sellingProduct
  it('ying gai neng gou huo quTop sellingProduct', async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/products/top-selling?limit=5`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      expect(response.status).to.equal(200);
      expect(response.data.success).to.be.true;
      expect(response.data.data).to.be.an('array');
      
      console.log('huo quTop sellingProductSucceeded，Productshu liang:', response.data.data.length);
    } catch (error) {
      console.error('huo quTop sellingProductFailed:', error.response?.data || error.message);
      throw error;
    }
  });

  // TestBatchUpdateProductStatus
  it('ying gai neng gouBatchUpdateProductStatus', async () => {
    if (!testProductId) {
      console.log('tiao guoBatchUpdateProductStatusTest，mei you ke yong deProductID');
      return;
    }

    try {
      const response = await axios.put(`${BASE_URL}/admin/products/batch-status`, {
        productIds: [testProductId],
        status: 'active'
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      expect(response.status).to.equal(200);
      expect(response.data.success).to.be.true;
      expect(response.data.data).to.have.property('updatedCount');
      
      console.log('BatchUpdateProductStatusSucceeded:', response.data.data);
    } catch (error) {
      console.error('BatchUpdateProductStatusFailed:', error.response?.data || error.message);
      throw error;
    }
  });

  // TestDeleteProduct
  it('ying gai neng gouDeleteProduct', async () => {
    if (!testProductId) {
      console.log('tiao guoDeleteProductTest，mei you ke yong deProductID');
      return;
    }

    try {
      const response = await axios.delete(`${BASE_URL}/admin/products/${testProductId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      expect(response.status).to.equal(200);
      expect(response.data.success).to.be.true;
      
      console.log('DeleteProductSucceeded');
    } catch (error) {
      console.error('DeleteProductFailed:', error.response?.data || error.message);
      throw error;
    }
  });

  // TestDeleteProductCategory
  it('ying gai neng gouDeleteProductCategory', async () => {
    if (!testCategoryId) {
      console.log('tiao guoDeleteCategoryTest，mei you ke yong deCategoryID');
      return;
    }

    try {
      const response = await axios.delete(`${BASE_URL}/admin/categories/${testCategoryId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      expect(response.status).to.equal(200);
      expect(response.data.success).to.be.true;
      
      console.log('DeleteCategorySucceeded');
    } catch (error) {
      console.error('DeleteCategoryFailed:', error.response?.data || error.message);
      throw error;
    }
  });

  // Testgong kaiAPI
  describe('gong kaiProductAPITest', () => {
    // Testhuo qu gong kaiProductList
    it('ying gai neng gou huo qu gong kaiProductList', async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products`);

        expect(response.status).to.equal(200);
        expect(response.data.success).to.be.true;
        expect(response.data.data).to.have.property('products');
        expect(response.data.data.products).to.be.an('array');
        
        console.log('huo qu gong kaiProductListSucceeded，Productshu liang:', response.data.data.products.length);
      } catch (error) {
        console.error('huo qu gong kaiProductListFailed:', error.response?.data || error.message);
        throw error;
      }
    });

    // Testhuo quProductCategory
    it('ying gai neng gou huo qu gong kaiProductCategory', async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products/categories`);

        expect(response.status).to.equal(200);
        expect(response.data.success).to.be.true;
        expect(response.data.data).to.be.an('array');
        
        console.log('huo qu gong kaiProductCategorySucceeded，Categoryshu liang:', response.data.data.length);
      } catch (error) {
        console.error('huo qu gong kaiProductCategoryFailed:', error.response?.data || error.message);
        throw error;
      }
    });

    // TestSearchProduct
    it('ying gai neng gouSearchProduct', async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products?keyword=shou ji&category=1&sort=points_desc`);

        expect(response.status).to.equal(200);
        expect(response.data.success).to.be.true;
        expect(response.data.data).to.have.property('products');
        expect(response.data.data.products).to.be.an('array');
        
        console.log('SearchProductSucceeded，Productshu liang:', response.data.data.products.length);
      } catch (error) {
        console.error('SearchProductFailed:', error.response?.data || error.message);
        throw error;
      }
    });
  });
});

// ru guo zhi jie yun xing ci wen jian，zhi xingTest
if (require.main === module) {
  // qi dong fu wu qi
  console.log('kai shiTestAdminProduct ManagementAPI...');
  console.log('qing que bao fu wu qi yi jing qi dong zai http://localhost:3001');
  console.log('ru guo xu yao，qing xian yun xing: npm start');
  console.log('');
}