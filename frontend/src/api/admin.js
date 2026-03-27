import api from './index'

// Adminxiang guanAPIjie kou
export const apiAdmin = {
  // AdminLogin
  login: (username, password) => api.post('/admin/login', {
    username,
    password
  }),
  
  // huo quSystemStatus
  getSystemStatus: () => api.get('/admin/system-status'),
  
  // Product Managementxiang guan
  products: {
    // huo quProductList
    getList: (params) => api.get('/admin/products', { params }),
    
    // huo quProduct Detail
    getDetail: (id) => api.get(`/admin/products/${id}`),
    
    // CreateProduct
    create: (data) => api.post('/admin/products', data),
    
    // UpdateProduct
    update: (id, data) => api.put(`/admin/products/${id}`, data),
    
    // DeleteProduct
    delete: (id) => api.delete(`/admin/products/${id}`),
    
    // UpdateProductStatus
    updateStatus: (id, status) => api.put(`/admin/products/${id}/status`, { status }),
    
    // UpdateProductStock
    updateStock: (id, stock) => api.put(`/admin/products/${id}/stock`, { stock }),
    
    // BatchImportProduct
    import: (formData) => api.post('/admin/products/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
    
    // ExportProduct
    export: (params) => api.get('/admin/products/export', { 
      params,
      responseType: 'blob'
    })
  },
  
  // Categoryguan li xiang guan
  categories: {
    // huo quCategoryList
    getList: () => api.get('/admin/categories'),
    
    // CreateCategory
    create: (data) => api.post('/admin/categories', data),
    
    // UpdateCategory
    update: (id, data) => api.put(`/admin/categories/${id}`, data),
    
    // DeleteCategory
    delete: (id) => api.delete(`/admin/categories/${id}`)
  },
  
  // Order Managementxiang guan
  orders: {
    // huo quOrderList
    getList: (params) => api.get('/admin/orders', { params }),
    
    // huo quOrderDetails
    getDetail: (id) => api.get(`/admin/orders/${id}`),
    
    // UpdateOrderStatus
    updateStatus: (id, status, remark) => api.put(`/admin/orders/${id}/status`, { status, remark })
  },
  
  // User Managementxiang guan
  users: {
    // huo quUserList
    getList: (params) => api.get('/admin/users', { params }),
    
    // huo quUserDetails
    getDetail: (id) => api.get(`/admin/users/${id}`),
    
    // tiao zhengUserPoints
    updatePoints: (id, data) => api.put(`/admin/users/${id}/points`, data),
    
    // UpdateUserStatus
    updateStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status })
  },
  
  // System Settingsxiang guan
  settings: {
    // huo quSystem Settings
    get: () => api.get('/admin/settings'),
    
    // UpdateSystem Settings
    update: (data) => api.put('/admin/settings', data)
  },
  
  // Statisticsbao biao xiang guan
  statistics: {
    // huo qu xiao shouStatistics
    getSales: (params) => api.get('/admin/statistics/sales', { params }),
    
    // huo quUserStatistics
    getUsers: (params) => api.get('/admin/statistics/users', { params }),
    
    // huo quProductStatistics
    getProducts: (params) => api.get('/admin/statistics/products', { params })
  },
  
  // wen jianUpload
  upload: (formData) => api.post('/admin/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export default apiAdmin