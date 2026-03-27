const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
let userToken = '';
let testCartId = null;

// Testshu ju
const testUser = {
  username: 'user1',
  password: 'password1'
};

// TestProductshu ju
const testProducts = [
  { productId: 1, quantity: 2 },  // Smartphone
  { productId: 2, quantity: 1 },  // Bluetooth Earbuds
  { productId: 3, quantity: 3 }   // Insulated Bottle
];

// huo quUsertoken
async function getUserToken() {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username: testUser.username,
      password: testUser.password,
      type: 'user'
    });
    
    if (response.data.success) {
      userToken = response.data.token;
      console.log('✅ UserLoginSucceeded');
      return true;
    } else {
      console.error('❌ UserLoginFailed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ UserLoginFailed:', error.response?.data?.message || error.message);
    return false;
  }
}

// huo quCartList
async function getCart() {
  try {
    const response = await axios.get(`${BASE_URL}/cart`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    if (response.data.success) {
      console.log('✅ huo quCartSucceeded');
      console.log('CartProductshu liang:', response.data.data.cartItems.length);
      console.log('CartStatisticsInfo:', response.data.data.summary);
      return response.data;
    } else {
      console.error('❌ huo quCartFailed:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ huo quCartFailed:', error.response?.data?.message || error.message);
    return null;
  }
}

// tian jiaProductdaoCart
async function addToCart(productId, quantity) {
  try {
    const response = await axios.post(`${BASE_URL}/cart`, {
      productId,
      quantity
    }, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    if (response.data.success) {
      console.log(`✅ tian jiaProduct(ID: ${productId})daoCartSucceeded，shu liang: ${quantity}`);
      return response.data;
    } else {
      console.error(`❌ tian jiaProduct(ID: ${productId})daoCartFailed:`, response.data.message);
      return null;
    }
  } catch (error) {
    console.error(`❌ tian jiaProduct(ID: ${productId})daoCartFailed:`, error.response?.data?.message || error.message);
    return null;
  }
}

// UpdateCartProductshu liang
async function updateCartQuantity(cartId, quantity) {
  try {
    const response = await axios.put(`${BASE_URL}/cart/${cartId}`, {
      quantity
    }, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    if (response.data.success) {
      console.log(`✅ UpdateCartProduct(ID: ${cartId})shu liangSucceeded，xin shu liang: ${quantity}`);
      return response.data;
    } else {
      console.error(`❌ UpdateCartProduct(ID: ${cartId})shu liangFailed:`, response.data.message);
      return null;
    }
  } catch (error) {
    console.error(`❌ UpdateCartProduct(ID: ${cartId})shu liangFailed:`, error.response?.data?.message || error.message);
    return null;
  }
}

// UpdateCartProductxuan zhongStatus
async function updateCartSelection(cartId, isSelected) {
  try {
    const response = await axios.put(`${BASE_URL}/cart/${cartId}/selection`, {
      isSelected
    }, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    if (response.data.success) {
      console.log(`✅ UpdateCartProduct(ID: ${cartId})xuan zhongStatusSucceeded，Status: ${isSelected ? 'xuan zhong' : 'wei xuan zhong'}`);
      return response.data;
    } else {
      console.error(`❌ UpdateCartProduct(ID: ${cartId})xuan zhongStatusFailed:`, response.data.message);
      return null;
    }
  } catch (error) {
    console.error(`❌ UpdateCartProduct(ID: ${cartId})xuan zhongStatusFailed:`, error.response?.data?.message || error.message);
    return null;
  }
}

// BatchUpdateCartProductxuan zhongStatus
async function batchUpdateCartSelection(cartIds, isSelected) {
  try {
    const response = await axios.put(`${BASE_URL}/cart/batch-update-selection`, {
      cartIds,
      isSelected
    }, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    if (response.data.success) {
      console.log(`✅ BatchUpdateCartProductxuan zhongStatusSucceeded，Status: ${isSelected ? 'xuan zhong' : 'wei xuan zhong'}`);
      console.log(`Updatele ${response.data.data.updatedCount} geProduct`);
      return response.data;
    } else {
      console.error('❌ BatchUpdateCartProductxuan zhongStatusFailed:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ BatchUpdateCartProductxuan zhongStatusFailed:', error.response?.data?.message || error.message);
    return null;
  }
}

// DeleteCartProduct
async function removeFromCart(cartId) {
  try {
    const response = await axios.delete(`${BASE_URL}/cart/${cartId}`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    if (response.data.success) {
      console.log(`✅ DeleteCartProduct(ID: ${cartId})Succeeded`);
      return response.data;
    } else {
      console.error(`❌ DeleteCartProduct(ID: ${cartId})Failed:`, response.data.message);
      return null;
    }
  } catch (error) {
    console.error(`❌ DeleteCartProduct(ID: ${cartId})Failed:`, error.response?.data?.message || error.message);
    return null;
  }
}

// BatchDeleteCartProduct
async function batchRemoveFromCart(cartIds) {
  try {
    const response = await axios.delete(`${BASE_URL}/cart/batch-remove`, {
      data: { cartIds }
    }, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    if (response.data.success) {
      console.log(`✅ BatchDeleteCartProductSucceeded`);
      console.log(`Deletele ${response.data.data.deletedCount} geProduct`);
      return response.data;
    } else {
      console.error('❌ BatchDeleteCartProductFailed:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ BatchDeleteCartProductFailed:', error.response?.data?.message || error.message);
    return null;
  }
}

// qing kongCart
async function clearCart() {
  try {
    const response = await axios.delete(`${BASE_URL}/cart/clear`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    if (response.data.success) {
      console.log(`✅ qing kongCartSucceeded`);
      return response.data;
    } else {
      console.error('❌ qing kongCartFailed:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ qing kongCartFailed:', error.response?.data?.message || error.message);
    return null;
  }
}

// huo quCartStatisticsInfo
async function getCartSummary() {
  try {
    const response = await axios.get(`${BASE_URL}/cart/summary`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    if (response.data.success) {
      console.log('✅ huo quCartStatisticsInfoSucceeded');
      console.log('StatisticsInfo:', response.data.data);
      return response.data;
    } else {
      console.error('❌ huo quCartStatisticsInfoFailed:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ huo quCartStatisticsInfoFailed:', error.response?.data?.message || error.message);
    return null;
  }
}

// huo qu xuan zhong deCartProduct（yong yu xia dan）
async function getSelectedItems() {
  try {
    const response = await axios.get(`${BASE_URL}/cart/selected`, {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    
    if (response.data.success) {
      console.log('✅ huo qu xuan zhongProductSucceeded');
      console.log('xuan zhongProductshu liang:', response.data.data.items.length);
      console.log('zongPoints:', response.data.data.totalPoints);
      return response.data;
    } else {
      console.error('❌ huo qu xuan zhongProductFailed:', response.data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ huo qu xuan zhongProductFailed:', error.response?.data?.message || error.message);
    return null;
  }
}

// zhuTesthan shu
async function runTests() {
  console.log('🧪 kai shiCartAPITest...\n');
  
  // 1. Loginhuo qutoken
  console.log('\n🔐 bu zhou 1: UserLogin');
  const loginSuccess = await getUserToken();
  if (!loginSuccess) {
    console.log('❌ TestFailed: wu fa huo quUsertoken');
    return;
  }
  
  // 2. huo qu chu shiCart
  console.log('\n🛒 bu zhou 2: huo qu chu shiCart');
  await getCart();
  await getCartSummary();
  
  // 3. tian jiaProductdaoCart
  console.log('\n➕ bu zhou 3: tian jiaProductdaoCart');
  for (const product of testProducts) {
    await addToCart(product.productId, product.quantity);
  }
  
  // 4. huo quUpdatehou deCart
  console.log('\n🛒 bu zhou 4: huo quUpdatehou deCart');
  const updatedCart = await getCart();
  await getCartSummary();
  
  // 5. huo quCartzhong de di yi geProductID，yong yu hou xuTest
  if (updatedCart && updatedCart.data.cartItems.length > 0) {
    testCartId = updatedCart.data.cartItems[0].id;
    
    // 6. UpdateProductshu liang
    console.log('\n🔄 bu zhou 5: UpdateProductshu liang');
    await updateCartQuantity(testCartId, 5);
    await getCartSummary();
    
    // 7. UpdateProductxuan zhongStatus
    console.log('\n✅ bu zhou 6: UpdateProductxuan zhongStatus');
    await updateCartSelection(testCartId, false);
    await getCartSummary();
    await updateCartSelection(testCartId, true);
    await getCartSummary();
    
    // 8. huo qu suo youCartProductID，yong yuBatchcao zuo
    const cartIds = updatedCart.data.cartItems.map(item => item.id);
    
    // 9. BatchUpdatexuan zhongStatus
    console.log('\n✅✅ bu zhou 7: BatchUpdatexuan zhongStatus');
    await batchUpdateCartSelection(cartIds, false);
    await getCartSummary();
    await batchUpdateCartSelection(cartIds, true);
    await getCartSummary();
    
    // 10. huo qu xuan zhong deProduct
    console.log('\n📦 bu zhou 8: huo qu xuan zhong deProduct');
    await getSelectedItems();
    
    // 11. Deletedan geProduct
    console.log('\n🗑️ bu zhou 9: Deletedan geProduct');
    await removeFromCart(testCartId);
    await getCart();
    await getCartSummary();
    
    // 12. Deletesheng yuProduct
    const remainingCart = await getCart();
    if (remainingCart && remainingCart.data.cartItems.length > 0) {
      const remainingIds = remainingCart.data.cartItems.map(item => item.id);
      
      // 13. BatchDeleteProduct
      console.log('\n🗑️🗑️ bu zhou 10: BatchDeleteProduct');
      await batchRemoveFromCart(remainingIds);
      await getCart();
      await getCartSummary();
    }
  }
  
  // 14. chong xin tian jia yi xieProduct，ran hou qing kongCart
  console.log('\n➕🗑️ bu zhou 11: chong xin tian jiaProductbing qing kongCart');
  await addToCart(testProducts[0].productId, testProducts[0].quantity);
  await addToCart(testProducts[1].productId, testProducts[1].quantity);
  await getCart();
  await getCartSummary();
  await clearCart();
  await getCart();
  await getCartSummary();
  
  console.log('\n🎉 CartAPITestwan cheng！');
}

// yun xingTest
runTests().catch(error => {
  console.error('❌ Testyun xing chu cuo:', error);
  process.exit(1);
});