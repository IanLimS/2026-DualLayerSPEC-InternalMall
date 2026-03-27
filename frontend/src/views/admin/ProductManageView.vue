<template>
  <AdminLayout>
    <div class="product-manage">
      <div class="header">
        <h2>Product Management</h2>
        <div class="header-actions">
          <el-button type="primary" @click="showCategoryDialog">
            <el-icon><Setting /></el-icon>
            Categoryguan li
          </el-button>
        </div>
      </div>
    
    <!-- ProductList -->
    <ProductList
      @add="handleAddProduct"
      @edit="handleEditProduct"
    />
    
    <!-- Create/EditProductdui hua kuang -->
    <ProductForm
      v-model:visible="productFormVisible"
      :product="currentProduct"
      :is-edit="isEditProduct"
      @success="handleProductSuccess"
    />
    
      <!-- Categoryguan li dui hua kuang -->
      <CategoryManage v-model:visible="categoryDialogVisible" />
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import ProductList from '@/components/admin/ProductList.vue'
import ProductForm from '@/components/admin/ProductForm.vue'
import CategoryManage from '@/components/admin/CategoryManage.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useProductStore } from '@/stores/product'

// Store
const productStore = useProductStore()

// Refs
const productFormVisible = ref(false)
const categoryDialogVisible = ref(false)
const currentProduct = ref({})
const isEditProduct = ref(false)

// Methods
const handleAddProduct = () => {
  currentProduct.value = {}
  isEditProduct.value = false
  productFormVisible.value = true
}

const handleEditProduct = (product) => {
  currentProduct.value = { ...product }
  isEditProduct.value = true
  productFormVisible.value = true
}

const handleProductSuccess = () => {
  // shua xinProductList
  productStore.fetchProducts()
}

const showCategoryDialog = () => {
  categoryDialogVisible.value = true
}
</script>

<style scoped>
.product-manage {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
}
</style>