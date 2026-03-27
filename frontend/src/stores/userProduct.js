import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiProduct } from '@/api/product'

export const useUserProductStore = defineStore('userProduct', () => {
  // Status
  const products = ref([])
  const categories = ref([])
  const currentProduct = ref(null)
  const favorites = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })
  
  // guo lv tiao jian
  const filters = ref({
    category: '',
    keyword: '',
    minPoints: '',
    maxPoints: '',
    sort: 'created_desc'
  })
  
  // ji suan shu xing
  const activeProducts = computed(() => 
    products.value.filter(product => product.status === 'active')
  )
  
  const favoriteProductIds = computed(() => 
    favorites.value.map(fav => fav.id)
  )
  
  const productsWithFavoriteStatus = computed(() => 
    products.value.map(product => ({
      ...product,
      isFavorite: favoriteProductIds.value.includes(product.id)
    }))
  )
  
  // fang fa
  // huo quProductList
  const fetchProducts = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const queryParams = {
        page: pagination.value.page,
        limit: pagination.value.limit,
        ...filters.value,
        ...params
      }
      
      const response = await apiProduct.getProducts(queryParams)
      
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
      const response = await apiProduct.getProductDetail(id)
      
      if (response.success) {
        currentProduct.value = {
          ...response.data,
          isFavorite: favoriteProductIds.value.includes(response.data.id)
        }
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
  
  // huo quProductCategory
  const fetchCategories = async () => {
    try {
      const response = await apiProduct.getCategories()
      
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
  
  // SearchProduct
  const searchProducts = async (searchParams) => {
    loading.value = true
    error.value = null
    
    try {
      const queryParams = {
        page: 1,
        limit: pagination.value.limit,
        ...searchParams
      }
      
      const response = await apiProduct.searchProducts(queryParams)
      
      if (response.success) {
        products.value = response.data.products
        pagination.value = response.data.pagination
      } else {
        error.value = response.message || 'SearchProductFailed'
      }
    } catch (err) {
      error.value = err.message || 'wang luo qing qiuFailed'
      console.error('SearchProductFailed:', err)
    } finally {
      loading.value = false
    }
  }
  
  // tian jiaProductFavorites
  const addFavorite = async (productId) => {
    try {
      const response = await apiProduct.addFavorite(productId)
      
      if (response.success) {
        // ru guo you dang qianProductqieIDpi pei，UpdateFavoritesStatus
        if (currentProduct.value && currentProduct.value.id === productId) {
          currentProduct.value.isFavorite = true
        }
        
        // huo qu zui xinFavoritesList
        await fetchFavorites()
        
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (err) {
      console.error('tian jiaFavoritesFailed:', err)
      return { success: false, message: err.message }
    }
  }
  
  // qu xiaoProductFavorites
  const removeFavorite = async (productId) => {
    try {
      const response = await apiProduct.removeFavorite(productId)
      
      if (response.success) {
        // ru guo you dang qianProductqieIDpi pei，UpdateFavoritesStatus
        if (currentProduct.value && currentProduct.value.id === productId) {
          currentProduct.value.isFavorite = false
        }
        
        // huo qu zui xinFavoritesList
        await fetchFavorites()
        
        return { success: true }
      } else {
        return { success: false, message: response.message }
      }
    } catch (err) {
      console.error('qu xiaoFavoritesFailed:', err)
      return { success: false, message: err.message }
    }
  }
  
  // huo quFavoritesProductList
  const fetchFavorites = async () => {
    try {
      const response = await apiProduct.getFavorites({
        page: 1,
        limit: 100  // huo qu suo youFavorites，bi mianPaginationwen ti
      })
      
      if (response.success) {
        favorites.value = response.data.products
      }
    } catch (err) {
      console.error('huo quFavoritesListFailed:', err)
    }
  }
  
  // qie huanFavoritesStatus
  const toggleFavorite = async (product) => {
    if (product.isFavorite) {
      return await removeFavorite(product.id)
    } else {
      return await addFavorite(product.id)
    }
  }
  
  // Updateguo lv tiao jian
  const updateFilters = (newFilters) => {
    Object.assign(filters.value, newFilters)
    pagination.value.page = 1  // zhong zhi ye ma
  }
  
  // zhong zhi guo lv tiao jian
  const resetFilters = () => {
    filters.value = {
      category: '',
      keyword: '',
      minPoints: '',
      maxPoints: '',
      sort: 'created_desc'
    }
    pagination.value.page = 1
  }
  
  // zhong zhiStatus
  const resetState = () => {
    products.value = []
    categories.value = []
    currentProduct.value = null
    favorites.value = []
    loading.value = false
    error.value = null
    pagination.value = {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0
    }
    filters.value = {
      category: '',
      keyword: '',
      minPoints: '',
      maxPoints: '',
      sort: 'created_desc'
    }
  }
  
  return {
    // Status
    products,
    categories,
    currentProduct,
    favorites,
    loading,
    error,
    pagination,
    filters,
    
    // ji suan shu xing
    activeProducts,
    favoriteProductIds,
    productsWithFavoriteStatus,
    
    // fang fa
    fetchProducts,
    fetchProductDetail,
    fetchCategories,
    searchProducts,
    addFavorite,
    removeFavorite,
    fetchFavorites,
    toggleFavorite,
    updateFilters,
    resetFilters,
    resetState
  }
})