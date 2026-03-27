<template>
  <div class="cart-view">
    <h2 class="page-title">wo deCart</h2>
    
    <!-- Cart is empty -->
    <div v-if="totalCount === 0" class="empty-cart">
      <div class="empty-cart-content">
        <svg-icon name="shopping-cart" size="80px" />
        <h3>Carthai shi kong de</h3>
        <p>kuai qu tiao xuan xin yi deProductba！</p>
        <el-button type="primary" @click="goToProductList">qu guang guang</el-button>
      </div>
    </div>
    
    <!-- CartyouProduct -->
    <div v-else class="cart-content">
      <!-- quan xuan heBatchcao zuo -->
      <div class="cart-header">
        <div class="select-all">
          <el-checkbox 
            v-model="allSelectedComputed" 
            @change="handleSelectAllChange"
            :disabled="loading"
          >
            quan xuan
          </el-checkbox>
          <span class="selected-count">yi xuan ze {{ cartSummary.selectedCount }} jian</span>
        </div>
        
        <div class="batch-actions" v-if="selectedItems.length > 0">
          <el-button 
            type="danger" 
            size="small" 
            @click="handleBatchDelete"
            :disabled="loading"
          >
            Deletexuan zhong
          </el-button>
        </div>
      </div>
      
      <!-- CartList -->
      <div class="cart-list" v-loading="loading">
        <div 
          v-for="item in cartItems" 
          :key="item.id"
          class="cart-item"
        >
          <!-- xuan ze kuang -->
          <div class="item-select">
            <el-checkbox 
              v-model="item.is_selected"
              @change="handleItemSelectChange(item)"
              :disabled="loading"
            ></el-checkbox>
          </div>
          
          <!-- Producttu pian -->
          <div class="item-image">
            <el-image 
              :src="item.images && item.images.length > 0 ? item.images[0] : '/placeholder-product.jpg'"
              :preview-src-list="item.images || []"
              fit="cover"
              class="product-image"
            >
              <template #error>
                <div class="image-error">
                  <svg-icon name="image-error" size="40px" />
                </div>
              </template>
            </el-image>
          </div>
          
          <!-- ProductInfo -->
          <div class="item-info">
            <div class="product-name">{{ item.product_name }}</div>
            <div class="product-category">{{ item.category_name }}</div>
            <div class="product-points">suo xuPoints: {{ item.points_required }}</div>
          </div>
          
          <!-- shu liang tiao zheng -->
          <div class="item-quantity">
            <el-input-number 
              v-model="item.quantity"
              :min="1"
              :max="item.stock"
              @change="handleQuantityChange(item)"
              :disabled="loading"
              size="small"
            ></el-input-number>
            <div class="stock-info">Stock: {{ item.stock }}</div>
          </div>
          
          <!-- xiao ji -->
          <div class="item-subtotal">
            <div class="subtotal-points">{{ item.quantity * item.points_required }} Points</div>
          </div>
          
          <!-- cao zuo -->
          <div class="item-actions">
            <el-button 
              type="danger" 
              size="small" 
              icon="Delete"
              @click="handleDeleteItem(item)"
              :disabled="loading"
              circle
            ></el-button>
          </div>
        </div>
      </div>
      
      <!-- Cartdi bu -->
      <div class="cart-footer">
        <div class="footer-left">
          <el-button 
            type="text" 
            @click="handleClearCart"
            :disabled="loading"
          >
            qing kongCart
          </el-button>
        </div>
        
        <div class="footer-right">
          <div class="total-info">
            <div class="selected-count">yi xuan {{ cartSummary.selectedCount }} jianProduct</div>
            <div class="total-points">he ji: {{ cartSummary.totalPoints }} Points</div>
          </div>
          
          <el-button 
            type="primary" 
            size="large"
            @click="goToCheckout"
            :disabled="cartSummary.selectedCount === 0 || loading"
          >
            qu jie suan
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuthStore } from '@/stores/auth';
import { 
  cartItems, 
  cartSummary, 
  loading, 
  totalCount, 
  selectedItems,
  allSelected,
  fetchCart,
  updateQuantity,
  updateSelection,
  batchUpdateSelection,
  removeItem,
  removeSelectedItems,
  clearCartItems
} from '@/stores/cart';

const router = useRouter();

// ji suan shu xing
const allSelectedComputed = {
  get() {
    return allSelected.value;
  },
  set(value) {
    batchUpdateSelection(value).then(success => {
      if (success) {
        ElMessage.success(value ? 'yi quan xuan' : 'Cancelledquan xuan');
      }
    });
  }
};

// Initialize
onMounted(() => {
  // jian chaUsershi fou yiLogin
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    ElMessage.warning('Please log in first')
    router.push('/login')
    return
  }
  
  fetchCart();
});

// chu li quan xuan bian hua
const handleSelectAllChange = (value) => {
  batchUpdateSelection(value).then(success => {
    if (success) {
      ElMessage.success(value ? 'yi quan xuan' : 'Cancelledquan xuan');
    }
  });
};

// chu li dan geProductxuan zhong bian hua
const handleItemSelectChange = (item) => {
  updateSelection(item.id, item.is_selected).then(success => {
    if (success) {
      ElMessage.success(item.is_selected ? 'yi xuan zhong' : 'Cancelledxuan zhong');
    }
  });
};

// chu li shu liang bian hua
const handleQuantityChange = (item) => {
  updateQuantity(item.id, item.quantity).then(success => {
    if (success) {
      ElMessage.success('shu liang yiUpdate');
    }
  });
};

// Deletedan geProduct
const handleDeleteItem = (item) => {
  ElMessageBox.confirm(
    `que ding yaoDelete ${item.product_name} ma？`,
    'DeleteProduct',
    {
      confirmButtonText: 'que ding',
      cancelButtonText: 'qu xiao',
      type: 'warning',
    }
  ).then(() => {
    removeItem(item.id).then(success => {
      if (success) {
        ElMessage.success('ProductyiDelete');
      }
    });
  });
};

// BatchDeletexuan zhong deProduct
const handleBatchDelete = () => {
  ElMessageBox.confirm(
    `que ding yaoDeletexuan zhong de ${selectedItems.value.length} jianProductma？`,
    'BatchDelete',
    {
      confirmButtonText: 'que ding',
      cancelButtonText: 'qu xiao',
      type: 'warning',
    }
  ).then(() => {
    removeSelectedItems().then(success => {
      if (success) {
        ElMessage.success('ProductyiDelete');
      }
    });
  });
};

// qing kongCart
const handleClearCart = () => {
  ElMessageBox.confirm(
    'que ding yao qing kongCartma？ci cao zuo bu ke hui fu',
    'qing kongCart',
    {
      confirmButtonText: 'que ding',
      cancelButtonText: 'qu xiao',
      type: 'warning',
    }
  ).then(() => {
    clearCartItems().then(success => {
      if (success) {
        ElMessage.success('Cartyi qing kong');
      }
    });
  });
};

// tiao zhuan daoProductList
const goToProductList = () => {
  router.push('/products');
};

// tiao zhuan dao jie suan ye mian
const goToCheckout = () => {
  router.push('/checkout');
};
</script>

<style scoped>
.cart-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

/* kongCartyang shi */
.empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.empty-cart-content {
  text-align: center;
  padding: 40px;
}

.empty-cart-content h3 {
  margin: 20px 0 12px;
  font-size: 18px;
  color: #606266;
}

.empty-cart-content p {
  margin: 0 0 24px;
  color: #909399;
}

/* Cartnei rong yang shi */
.cart-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 16px;
}

.select-all {
  display: flex;
  align-items: center;
}

.selected-count {
  margin-left: 10px;
  color: #909399;
  font-size: 14px;
}

/* CartListyang shi */
.cart-list {
  margin-bottom: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #ebeef5;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-select {
  padding-right: 16px;
}

.item-image {
  width: 80px;
  height: 80px;
  margin-right: 16px;
}

.product-image {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.item-info {
  flex: 1;
  margin-right: 16px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-category {
  color: #909399;
  font-size: 14px;
  margin-bottom: 8px;
}

.product-points {
  color: #e6a23c;
  font-size: 14px;
  font-weight: 600;
}

.item-quantity {
  width: 120px;
  margin-right: 16px;
  text-align: center;
}

.stock-info {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.item-subtotal {
  width: 120px;
  text-align: right;
  margin-right: 16px;
}

.subtotal-points {
  color: #e6a23c;
  font-size: 16px;
  font-weight: 600;
}

.item-actions {
  width: 40px;
}

/* Cartdi bu yang shi */
.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.footer-right {
  display: flex;
  align-items: center;
}

.total-info {
  margin-right: 20px;
  text-align: right;
}

.selected-count {
  color: #606266;
  font-size: 14px;
  margin-bottom: 4px;
}

.total-points {
  color: #e6a23c;
  font-size: 18px;
  font-weight: 600;
}

/* xiang ying shi tiao zheng */
@media (max-width: 768px) {
  .cart-item {
    flex-wrap: wrap;
    padding: 16px;
  }
  
  .item-image {
    width: 60px;
    height: 60px;
    margin-right: 12px;
  }
  
  .item-info {
    width: calc(100% - 120px);
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .item-quantity {
    width: 100px;
    margin-right: 12px;
  }
  
  .item-subtotal {
    width: 100px;
    margin-right: 12px;
  }
  
  .item-actions {
    position: absolute;
    right: 16px;
    top: 16px;
  }
  
  .cart-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .footer-right {
    width: 100%;
    justify-content: space-between;
    margin-top: 16px;
  }
  
  .total-info {
    margin-right: 0;
  }
}
</style>