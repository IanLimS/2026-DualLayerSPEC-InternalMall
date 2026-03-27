import api from './index'

// Productxiang guanAPIjie kou
export const apiProduct = {
  // huo quProductCategory
  getCategories: () => api.get('/products/categories'),
  
  // huo quProductList
  getProducts: (params) => api.get('/products', { params }),
  
  // huo quProduct Detail
  getProductDetail: (id) => api.get(`/products/${id}`),
  
  // ProductSearch
  searchProducts: (params) => api.get('/products/search', { params }),
  
  // ProductFavorites
  addFavorite: (id) => api.post(`/products/${id}/favorite`),
  
  // qu xiaoFavorites
  removeFavorite: (id) => api.delete(`/products/${id}/favorite`),
  
  // huo quFavoritesProduct
  getFavorites: (params) => api.get('/products/favorites', { params })
}

// AdminProduct ManagementAPIjie kou
export const apiAdminProduct = {
  // huo quProductList（Admin）
  getAdminProducts: (params) => api.get('/admin/products', { params }),
  
  // huo quProduct Detail（Admin）
  getAdminProductDetail: (id) => api.get(`/admin/products/${id}`),
  
  // CreateProduct
  createProduct: (data) => api.post('/admin/products', data),
  
  // UpdateProduct
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  
  // DeleteProduct
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  
  // ProductshangUnpublish
  updateProductStatus: (id, status) => api.put(`/admin/products/${id}/status`, { status }),
  
  // UpdateProductStock
  updateProductStock: (id, stock) => api.put(`/admin/products/${id}/stock`, { stock }),
  
  // BatchImportProduct
  importProducts: (formData) => api.post('/admin/products/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  // ExportProduct
  exportProducts: (params) => api.get('/admin/products/export', { 
    params,
    responseType: 'blob'
  }),
  
  // huo quCategoryList（Admin）
  getAdminCategories: () => api.get('/admin/categories'),
  
  // CreateCategory
  createCategory: (data) => api.post('/admin/categories', data),
  
  // UpdateCategory
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  
  // DeleteCategory
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  
  // UploadProducttu pian
  uploadProductImage: (formData) => api.post('/admin/products/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export default {
  ...apiProduct,
  ...apiAdminProduct
}