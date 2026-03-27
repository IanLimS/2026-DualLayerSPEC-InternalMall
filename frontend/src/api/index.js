import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

// Createaxiosshi li
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// qing qiu lan jie qi
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// xiang ying lan jie qi
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const authStore = useAuthStore()
    
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // ru guo shi zaiLoginye mian shou dao401Error，xian shi ju ti deErrorxiao xi
          if (window.location.pathname === '/login') {
            ElMessage.error(data.message || 'UsernamehuoPasswordError')
          } else {
            ElMessage.error('Unauthorized，qing chong xinLogin')
            authStore.clearAuth()
            // zhong ding xiang daoLoginye
            window.location.href = '/login'
          }
          break
        case 403:
          ElMessage.error('Insufficient permissions')
          break
        case 404:
          ElMessage.error('qing qiu de zi yuanDoes not exist')
          break
        case 500:
          ElMessage.error('Server error')
          break
        default:
          ElMessage.error(data.message || 'qing qiuFailed')
      }
    } else if (error.request) {
      ElMessage.error('wang luo lian jieFailed，qing jian cha wang luo')
    } else {
      ElMessage.error('qing qiu pei zhiError')
    }
    
    return Promise.reject(error)
  }
)

// APIfang fa
export const apiHealth = {
  // Health Check
  check: () => api.get('/health'),
  
  // DatabaseStatusjian cha
  checkDatabase: () => api.get('/health/database')
}

export const apiAuth = {
  // UserLogin
  login: (username, password, type) => api.post('/auth/login', {
    username,
    password,
    type
  }),
  
  // UserLogout
  logout: () => api.post('/auth/logout')
}

export const apiUser = {
  // huo quUserInfo
  getProfile: () => api.get('/user/profile'),
  
  // UpdateUserInfo
  updateProfile: (data) => api.put('/user/profile', data),
  
  // huo quTestProductList
  getTestProducts: () => api.get('/user/test-products')
}

export const apiAdmin = {
  // AdminConnectivityTest
  test: () => api.get('/admin/test'),
  
  // huo quSystemStatus
  getSystemStatus: () => api.get('/admin/system-status')
}

export default api