import { ref, computed } from 'vue';
import { 
  getCart, 
  addToCart, 
  updateCartQuantity, 
  updateCartSelection,
  batchUpdateCartSelection,
  removeFromCart,
  batchRemoveFromCart,
  clearCart,
  getCartSummary
} from '@/api/cart';

const cartItems = ref([]);
const cartSummary = ref({
  selectedCount: 0,
  totalPoints: 0,
  totalQuantity: 0
});
const loading = ref(false);

// ji suan shu xing
const totalCount = computed(() => cartItems.value.length);
const selectedItems = computed(() => cartItems.value.filter(item => item.is_selected));
const allSelected = computed(() => totalCount.value > 0 && selectedItems.value.length === totalCount.value);

// huo quCartshu ju
const fetchCart = async () => {
  loading.value = true;
  try {
    const response = await getCart();
    if (response.success) {
      cartItems.value = response.message.cartItems || [];
      cartSummary.value = response.message.summary || {
        selectedCount: 0,
        totalPoints: 0,
        totalQuantity: 0
      };
    }
  } catch (error) {
    console.error('huo quCartFailed:', error);
  } finally {
    loading.value = false;
  }
};

// tian jiaProductdaoCart
const addProductToCart = async (productId, quantity = 1) => {
  loading.value = true;
  try {
    const response = await addToCart({ productId, quantity });
    if (response.success) {
      // UpdateCartshu ju
      await fetchCart();
      return true;
    }
    return false;
  } catch (error) {
    console.error('tian jiaProductdaoCartFailed:', error);
    return false;
  } finally {
    loading.value = false;
  }
};

// UpdateProductshu liang
const updateQuantity = async (cartId, quantity) => {
  loading.value = true;
  try {
    const response = await updateCartQuantity(cartId, { quantity });
    if (response.success) {
      // UpdateCartshu ju
      await fetchCart();
      return true;
    }
    return false;
  } catch (error) {
    console.error('UpdateCartProductshu liangFailed:', error);
    return false;
  } finally {
    loading.value = false;
  }
};

// UpdateProductxuan zhongStatus
const updateSelection = async (cartId, isSelected) => {
  loading.value = true;
  try {
    const response = await updateCartSelection(cartId, { isSelected });
    if (response.success) {
      // UpdateCartshu ju
      await fetchCart();
      return true;
    }
    return false;
  } catch (error) {
    console.error('UpdateCartProductxuan zhongStatusFailed:', error);
    return false;
  } finally {
    loading.value = false;
  }
};

// BatchUpdatexuan zhongStatus
const batchUpdateSelection = async (isSelected) => {
  loading.value = true;
  try {
    const cartIds = cartItems.value.map(item => item.id);
    const response = await batchUpdateCartSelection({ cartIds, isSelected });
    if (response.success) {
      // UpdateCartshu ju
      await fetchCart();
      return true;
    }
    return false;
  } catch (error) {
    console.error('BatchUpdateCartProductxuan zhongStatusFailed:', error);
    return false;
  } finally {
    loading.value = false;
  }
};

// DeleteCartProduct
const removeItem = async (cartId) => {
  loading.value = true;
  try {
    const response = await removeFromCart(cartId);
    if (response.success) {
      // UpdateCartshu ju
      await fetchCart();
      return true;
    }
    return false;
  } catch (error) {
    console.error('DeleteCartProductFailed:', error);
    return false;
  } finally {
    loading.value = false;
  }
};

// BatchDeletexuan zhong deProduct
const removeSelectedItems = async () => {
  loading.value = true;
  try {
    const selectedCartIds = selectedItems.value.map(item => item.id);
    if (selectedCartIds.length === 0) return false;
    
    const response = await batchRemoveFromCart({ cartIds: selectedCartIds });
    if (response.success) {
      // UpdateCartshu ju
      await fetchCart();
      return true;
    }
    return false;
  } catch (error) {
    console.error('BatchDeleteCartProductFailed:', error);
    return false;
  } finally {
    loading.value = false;
  }
};

// qing kongCart
const clearCartItems = async () => {
  loading.value = true;
  try {
    const response = await clearCart();
    if (response.success) {
      // UpdateCartshu ju
      await fetchCart();
      return true;
    }
    return false;
  } catch (error) {
    console.error('qing kongCartFailed:', error);
    return false;
  } finally {
    loading.value = false;
  }
};

// InitializeCart
const initCart = () => {
  fetchCart();
};

export {
  cartItems,
  cartSummary,
  loading,
  totalCount,
  selectedItems,
  allSelected,
  fetchCart,
  addProductToCart,
  updateQuantity,
  updateSelection,
  batchUpdateSelection,
  removeItem,
  removeSelectedItems,
  clearCartItems,
  initCart
};