<template>
  <div class="favorites-container">
    <!-- Userdao hang cai dan -->
    <div class="user-nav">
      <div class="nav-card">
        <div class="nav-title">gong neng dao hang</div>
        <div class="nav-list">
          <router-link to="/products" class="nav-item">
            <el-icon><Shop /></el-icon>
            <span>Product Browse</span>
          </router-link>
          <router-link to="/user/cart" class="nav-item">
            <el-icon><ShoppingCart /></el-icon>
            <span>wo deCart</span>
          </router-link>
          <router-link to="/user/favorites" class="nav-item active">
            <el-icon><Star /></el-icon>
            <span>wo deFavorites</span>
          </router-link>
          <router-link to="/user/profile" class="nav-item">
            <el-icon><User /></el-icon>
            <span>Profile</span>
          </router-link>
        </div>
      </div>
    </div>
    
    <div class="favorites-content">
      <div class="favorites-header">
        <h2>wo deFavorites</h2>
        <div class="header-actions">
          <el-button @click="goToProducts">ji xu liu lanProduct</el-button>
        </div>
      </div>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="4" animated />
    </div>
    
    <div v-else-if="favorites.length === 0" class="empty-container">
      <el-empty description="zan wuFavoritesProduct">
        <el-button type="primary" @click="goToProducts">qu liu lanProduct</el-button>
      </el-empty>
    </div>
    
    <div v-else class="favorites-content">
      <div class="products-grid">
        <ProductCard
          v-for="product in favorites"
          :key="product.id"
          :product="{ ...product, isFavorite: true }"
          @click="goToProductDetail(product.id)"
          @favorite="toggleFavorite(product)"
          @addToCart="addToCartFromFavorites(product)"
        />
      </div>
      
      <!-- Pagination -->
      <div v-if="pagination.total > pagination.limit" class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[12, 24, 48]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Shop, Star, User, ShoppingCart } from '@element-plus/icons-vue'
import { useUserProductStore } from '@/stores/userProduct'
import { addProductToCart } from '@/stores/cart'
import ProductCard from '@/components/product/ProductCard.vue'

const router = useRouter()
const productStore = useUserProductStore()

// ji suan shu xing
const loading = computed(() => productStore.loading)
const favorites = computed(() => productStore.favorites)
const pagination = computed(() => productStore.pagination)

// fang fa
const fetchFavorites = async () => {
  await productStore.fetchFavorites()
}

const goToProducts = () => {
  router.push('/products')
}

const goToProductDetail = (productId) => {
  router.push(`/products/${productId}`)
}

const toggleFavorite = async (product) => {
  const result = await productStore.toggleFavorite(product)
  if (result.success) {
    ElMessage.success('CancelledFavorites')
    // chong xin huo quFavoritesList
    await fetchFavorites()
  } else {
    ElMessage.error(result.message || 'cao zuoFailed')
  }
}

const addToCartFromFavorites = (product) => {
  addProductToCart(product.id, 1).then(success => {
    if (success) {
      ElMessage.success('Productyi jia ruCart')
    }
  })
}

const handleSizeChange = (size) => {
  // you yuFavoritesAPIke neng bu zhi chiPaginationda xiao xiu gai，zhe li chong xin huo qu shu ju
  productStore.pagination.limit = size
  productStore.pagination.page = 1
  fetchFavorites()
}

const handleCurrentChange = (page) => {
  // you yuFavoritesAPIke neng bu zhi chiPagination，zhe li chong xin huo qu shu ju
  productStore.pagination.page = page
  fetchFavorites()
}

// sheng ming zhou qi
onMounted(() => {
  fetchFavorites()
})
</script>

<style scoped>
.favorites-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.user-nav {
  margin-bottom: 20px;
}

.nav-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #303133;
}

.nav-list {
  display: flex;
  gap: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 6px;
  text-decoration: none;
  color: #606266;
  transition: all 0.3s;
}

.nav-item:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

.nav-item.active {
  background-color: #ecf5ff;
  color: #409eff;
  font-weight: 500;
}

.favorites-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.favorites-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.loading-container, .empty-container {
  padding: 40px 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .nav-list {
    flex-direction: column;
    gap: 8px;
  }
  
  .nav-item {
    padding: 12px 16px;
  }
  
  .favorites-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
}
</style>