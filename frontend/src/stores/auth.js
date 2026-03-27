import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Status
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  
  // ji suan shu xing
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isUser = computed(() => user.value?.role === 'user')
  
  // fang fa
  const setAuth = (authData) => {
    token.value = authData.token
    user.value = {
      id: authData.userId,
      username: authData.username,
      role: authData.userType
    }
    
    // bao cun dao ben di cun chu
    localStorage.setItem('token', authData.token)
    localStorage.setItem('user', JSON.stringify(user.value))
  }
  
  const clearAuth = () => {
    token.value = ''
    user.value = null
    
    // qing chu ben di cun chu
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
  
  return {
    // Status
    token,
    user,
    
    // ji suan shu xing
    isAuthenticated,
    isAdmin,
    isUser,
    
    // fang fa
    setAuth,
    clearAuth
  }
})