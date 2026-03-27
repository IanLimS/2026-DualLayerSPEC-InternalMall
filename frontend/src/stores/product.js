import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiAdminProduct } from '@/api/product'

export const useProductStore = defineStore('product', () => {
  // Status
  const products = ref([])
  const categories = ref([])
  const currentProduct = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  
  // guo lv tiao jian
  const filters = ref({
    status: '',
    categoryId: '',
    keyword: ''
  })
  
  // Sorttiao jian
  const sort = ref({
    prop: '',
    order: ''
  })
  
  // ji suan shu xing
  const activeProducts = computed(() => 
    products.value.filter(product => product.status === 'active')
  )
  
  const inactiveProducts = computed(() => 
    products.value.filter(product => product.status === 'inactive')
  )
  
  const productsByCategory = computed(() => {
    const result = {}
    products.value.forEach(product => {
      const categoryId = product.categoryId
      if (!result[categoryId]) {
        result[categoryId] = []
      }
      result[categoryId].push(product)
    })
    return result
  })
  
  const categoryName = computed(() => (categoryId) => {
    const category = categories.value.find(cat => cat.id === categoryId)
    return category ? category.name : 'weiCategory'
  })
  
  // fang fa
  // huo quProductList
  const fetchProducts = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const queryParams = {
        page: pagination.value.page,
        limit: pagination.value.limit,
        status: filters.value.status,
        category: filters.value.categoryId,
        keyword: filters.value.keyword,
        ...params
      }
      
      const response = await apiAdminProduct.getAdminProducts(queryParams)
      
      if (response.success) {
        products.value = response.data.products
        pagination.value = response.data.pagination
      } else {
        error.value = response.message || 'huo quProductListFailed'
      }
    } catch (err) {
      error.value = err.message || 'wang luo qing qiuFailed'
      console.error('huo quProductListFailed:', err)
    } finally {
      loading.value = false
    }
  }
  
  // huo quProduct Detail
  const fetchProductDetail = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiAdminProduct.getAdminProductDetail(id)
      
      if (response.success) {
        currentProduct.value = response.data
      } else {
        error.value = response.message || 'huo quProduct DetailFailed'
      }
    } catch (err) {
      error.value = err.message || 'wang luo qing qiuFailed'
      console.error('huo quProduct DetailFailed:', err)
    } finally {
      loading.value = false
    }
  }
  
  // CreateProduct
  const createProduct = async (productData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiAdminProduct.createProduct(productData)
      
      if (response.success) {
        // shua xinProductList
        await fetchProducts()
        return { success: true, data: response.data }
      } else {
        error.value = response.message || 'CreateProductFailed'
        return { success: false, message: response.message }
      }
    } catch (err) {
      error.value = err.message || 'wang luo qing qiuFailed'
      console.error('CreateProductFailed:', err)
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }
  
  // UpdateProduct
  const updateProduct = async (id, productData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiAdminProduct.updateProduct(id, productData)
      
      if (response.success) {
        // UpdateListzhong deProduct
        const index = products.value.findIndex(p => p.id === id)
        if (index !== -1) {
          products.value[index] = { ...products.value[index], ...response.data }
        }
        
        // ru guo dang qianEditde shi zhe geProduct，yeUpdate
        if (currentProduct.value && currentProduct.value.id === id) {
          currentProduct.value = { ...currentProduct.value, ...response.data }
        }
        
        return { success: true, data: response.data }
      } else {
        error.value = response.message || 'UpdateProductFailed'
        return { success: false, message: response.message }
      }
    } catch (err) {
      error.value = err.message || 'wang luo qing qiuFailed'
      console.error('UpdateProductFailed:', err)
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }
  
  // DeleteProduct
  const deleteProduct = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiAdminProduct.deleteProduct(id)
      
      if (response.success) {
        // chong xin huo quProductList，que bao shu ju tong bu
        await fetchProducts()
        
        // ru guo dang qianEditde shi zhe geProduct，qing kong
        if (currentProduct.value && currentProduct.value.id === id) {
          currentProduct.value = null
        }
        
        return { success: true, message: 'ProductDeleteSucceeded' }
      } else {
        error.value = response.message || 'DeleteProductFailed'
        return { success: false, message: response.message }
      }
    } catch (err) {
      error.value = err.message || 'wang luo qing qiuFailed'
      console.error('DeleteProductFailed:', err)
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }
  
  // UpdateProductStatus
  const updateProductStatus = async (id, status) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiAdminProduct.updateProductStatus(id, status)
      
      if (response.success) {
        // UpdateListzhong deProductStatus
        const index = products.value.findIndex(p => p.id === id)
        if (index !== -1) {
          products.value[index].status = status
        }
        
        // ru guo dang qianEditde shi zhe geProduct，yeUpdate
        if (currentProduct.value && currentProduct.value.id === id) {
          currentProduct.value.status = status
        }
        
        return { success: true, message: `Product${status === 'active' ? 'Publish' : 'Unpublish'}Succeeded` }
      } else {
        error.value = response.message || 'UpdateProductStatusFailed'
        return { success: false, message: response.message }
      }
    } catch (err) {
      error.value = err.message || 'wang luo qing qiuFailed'
      console.error('UpdateProductStatusFailed:', err)
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }
  
  // UpdateProductStock
  const updateProductStock = async (id, stock) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiAdminProduct.updateProductStock(id, stock)
      
      if (response.success) {
        // UpdateListzhong deProductStock
        const index = products.value.findIndex(p => p.id === id)
        if (index !== -1) {
          products.value[index].stock = stock
        }
        
        // ru guo dang qianEditde shi zhe geProduct，yeUpdate
        if (currentProduct.value && currentProduct.value.id === id) {
          currentProduct.value.stock = stock
        }
        
        return { success: true, message: 'StockUpdateSucceeded' }
      } else {
        error.value = response.message || 'UpdateStockFailed'
        return { success: false, message: response.message }
      }
    } catch (err) {
      error.value = err.message || 'wang luo qing qiuFailed'
      console.error('UpdateStockFailed:', err)
      return { success: false, message: err.message }
    } finally {
      loading.value = false
    }
  }
  
  // huo quProductCategory
  const fetchCategories = async () => {
    try {
      const response = await apiAdminProduct.getAdminCategories()
      
      if (response.success) {
        categories.value = response.data
      } else {
        error.value = response.message || 'huo quCategoryListFailed'
      }
    } catch (err) {
      error.value = err.message || 'wang luo qing qiuFailed'
      console.error('huo quCategoryListFailed:', err)
    }
  }
  
  // CreateCategory
  const createCategory = async (categoryData) => {
    try {
      const response = await apiAdminProduct.createCategory(categoryData)
      
      if (response.success) {
        // shua xinCategoryList
        await fetchCategories()
        return { success: true, data: response.data }
      } else {
        return { success: false, message: response.message }
      }
    } catch (err) {
      console.error('CreateCategoryFailed:', err)
      return { success: false, message: err.message }
    }
  }
  
  // UpdateCategory
  const updateCategory = async (id, categoryData) => {
    try {
      const response = await apiAdminProduct.updateCategory(id, categoryData)
      
      if (response.success) {
        // UpdateListzhong deCategory
        const index = categories.value.findIndex(c => c.id === id)
        if (index !== -1) {
          categories.value[index] = { ...categories.value[index], ...response.data }
        }
        
        return { success: true, data: response.data }
      } else {
        return { success: false, message: response.message }
      }
    } catch (err) {
      console.error('UpdateCategoryFailed:', err)
      return { success: false, message: err.message }
    }
  }
  
  // DeleteCategory
  const deleteCategory = async (id) => {
    try {
      const response = await apiAdminProduct.deleteCategory(id)
      
      if (response.success) {
        // congListzhong yi chuCategory
        categories.value = categories.value.filter(c => c.id !== id)
        return { success: true, message: 'CategoryDeleteSucceeded' }
      } else {
        return { success: false, message: response.message }
      }
    } catch (err) {
      console.error('DeleteCategoryFailed:', err)
      return { success: false, message: err.message }
    }
  }
  
  // zhong zhiStatus
  const resetState = () => {
    products.value = []
    categories.value = []
    currentProduct.value = null
    loading.value = false
    error.value = null
    pagination.value = {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    }
    filters.value = {
      status: '',
      categoryId: '',
      keyword: ''
    }
    sort.value = {
      prop: '',
      order: ''
    }
  }
  
  return {
    // Status
    products,
    categories,
    currentProduct,
    loading,
    error,
    pagination,
    filters,
    sort,
    
    // ji suan shu xing
    activeProducts,
    inactiveProducts,
    productsByCategory,
    categoryName,
    
    // fang fa
    fetchProducts,
    fetchProductDetail,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus,
    updateProductStock,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    resetState
  }
})