// jian dan deAPITestjiao ben
const http = require('http');
const https = require('https');

// fa songHTTPqing qiu de fu zhu han shu
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

// TestAPIhan shu
async function testAPI() {
  console.log('kai shiTestProduct ManagementAPI...\n');
  
  // TestHealth Check
  try {
    console.log('1. TestHealth CheckAPI...');
    const healthOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/health',
      method: 'GET'
    };
    
    const healthRes = await makeRequest(healthOptions);
    console.log(`Statusma: ${healthRes.statusCode}`);
    console.log(`xiang ying: ${healthRes.body}\n`);
  } catch (error) {
    console.error('Health CheckTestFailed:', error.message);
  }

  // TestAdminLogin
  let adminToken = null;
  try {
    console.log('2. TestAdminLoginAPI...');
    const loginOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/admin/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const loginData = JSON.stringify({
      username: 'admin',
      password: 'admin123'
    });
    
    const loginRes = await makeRequest(loginOptions, loginData);
    console.log(`Statusma: ${loginRes.statusCode}`);
    console.log(`xiang ying: ${loginRes.body}\n`);
    
    // jie xi xiang ying huo qutoken
    const loginResult = JSON.parse(loginRes.body);
    if (loginResult.success) {
      adminToken = loginResult.data.token;
      console.log('AdminLoginSucceeded，huo qu daotoken\n');
    }
  } catch (error) {
    console.error('AdminLoginTestFailed:', error.message);
  }

  // Testhuo quProductList（gong kaiAPI）
  try {
    console.log('3. Testhuo quProductList（gong kaiAPI）...');
    const productListOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/products',
      method: 'GET'
    };
    
    const productListRes = await makeRequest(productListOptions);
    console.log(`Statusma: ${productListRes.statusCode}`);
    console.log(`xiang ying: ${productListRes.body}\n`);
  } catch (error) {
    console.error('huo quProductListTestFailed:', error.message);
  }

  // Testhuo quProductCategory（gong kaiAPI）
  try {
    console.log('4. Testhuo quProductCategory（gong kaiAPI）...');
    const categoryListOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/products/categories',
      method: 'GET'
    };
    
    const categoryListRes = await makeRequest(categoryListOptions);
    console.log(`Statusma: ${categoryListRes.statusCode}`);
    console.log(`xiang ying: ${categoryListRes.body}\n`);
  } catch (error) {
    console.error('huo quProductCategoryTestFailed:', error.message);
  }

  // Testhuo quAdminProductList（xu yao ren zheng）
  if (adminToken) {
    try {
      console.log('5. Testhuo quAdminProductList（xu yao ren zheng）...');
      const adminProductListOptions = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/admin/products',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      };
      
      const adminProductListRes = await makeRequest(adminProductListOptions);
      console.log(`Statusma: ${adminProductListRes.statusCode}`);
      console.log(`xiang ying: ${adminProductListRes.body}\n`);
    } catch (error) {
      console.error('huo quAdminProductListTestFailed:', error.message);
    }

    // Testhuo quAdminCategoryList（xu yao ren zheng）
    try {
      console.log('6. Testhuo quAdminCategoryList（xu yao ren zheng）...');
      const adminCategoryListOptions = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/admin/categories',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      };
      
      const adminCategoryListRes = await makeRequest(adminCategoryListOptions);
      console.log(`Statusma: ${adminCategoryListRes.statusCode}`);
      console.log(`xiang ying: ${adminCategoryListRes.body}\n`);
    } catch (error) {
      console.error('huo quAdminCategoryListTestFailed:', error.message);
    }

    // TestCreateProduct（xu yao ren zheng）
    try {
      console.log('7. TestCreateProduct（xu yao ren zheng）...');
      const createProductOptions = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/admin/products',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      };
      
      const createProductData = JSON.stringify({
        name: 'APITestProduct',
        description: 'zhe shi yi ge tong guoAPICreatedeTestProduct',
        price: 99.99,
        pointsRequired: 20,
        stock: 50,
        categoryId: 1,
        specifications: {
          color: 'lan se',
          size: 'L'
        },
        exchangeRules: 'mei ren xian dui1ge'
      });
      
      const createProductRes = await makeRequest(createProductOptions, createProductData);
      console.log(`Statusma: ${createProductRes.statusCode}`);
      console.log(`xiang ying: ${createProductRes.body}\n`);
    } catch (error) {
      console.error('CreateProductTestFailed:', error.message);
    }
  }

  console.log('APITestwan cheng！');
}

// zhi xingTest
testAPI().catch(error => {
  console.error('Testguo cheng zhong fa shengError:', error);
});