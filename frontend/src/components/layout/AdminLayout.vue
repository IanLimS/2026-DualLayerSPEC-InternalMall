<template>
  <div class="admin-layout">
    <el-container class="admin-container">
      <!-- Sidebar -->
      <el-aside width="250px" class="admin-aside">
        <div class="admin-logo">
          <h2>Enterprise Mall</h2>
          <p>Admin Panel</p>
        </div>
        
        <el-menu
          :default-active="activeMenu"
          router
          class="admin-menu"
        >
          <el-menu-item index="/admin/dashboard">
            <el-icon><HomeFilled /></el-icon>
            <span>Dashboard</span>
          </el-menu-item>
          
          <el-menu-item index="/admin/products">
            <el-icon><ShoppingBag /></el-icon>
            <span>Product Management</span>
          </el-menu-item>
          
          <el-menu-item index="/admin/orders">
            <el-icon><Document /></el-icon>
            <span>Order Management</span>
          </el-menu-item>
          
          <el-menu-item index="/admin/users">
            <el-icon><User /></el-icon>
            <span>User Management</span>
          </el-menu-item>
          
          <el-menu-item index="/admin/settings">
            <el-icon><Setting /></el-icon>
            <span>System Settings</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <el-container>
        <!-- ding bu dao hang lan -->
        <el-header class="admin-header">
          <div class="header-left">
            <h3>{{ pageTitle }}</h3>
          </div>
          
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <el-avatar :size="30" :src="userAvatar || undefined">
                  <el-icon><UserFilled /></el-icon>
                </el-avatar>
                <span class="username">{{ authStore.user?.username || 'Admin' }}</span>
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">Profile</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>tui chuLogin</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        
        <!-- Main Content Area -->
        <el-main class="admin-main">
          <slot />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import { 
  HomeFilled, 
  ShoppingBag, 
  Document, 
  User, 
  Setting,
  UserFilled,
  ArrowDown
} from '@element-plus/icons-vue'

// Store
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

// Computed
const activeMenu = computed(() => route.path)
const userAvatar = computed(() => authStore.user?.avatar)

const pageTitle = computed(() => {
  const path = route.path
  switch (path) {
    case '/admin/dashboard':
      return 'Dashboard'
    case '/admin/products':
      return 'Product Management'
    case '/admin/orders':
      return 'Order Management'
    case '/admin/users':
      return 'User Management'
    case '/admin/settings':
      return 'System Settings'
    default:
      return 'Admin Panel'
  }
})

// Methods
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      // tiao zhuan daoProfileye mian
      router.push('/user/profile')
      break
    case 'logout':
      // zhi xingLogoutcao zuo
      handleLogout()
      break
  }
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    ElMessage.success('tui chuLoginSucceeded')
    router.push('/login')
  } catch (error) {
    console.error('tui chuLoginFailed:', error)
    ElMessage.error('tui chuLoginFailed')
  }
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}

.admin-container {
  height: 100%;
}

.admin-aside {
  background-color: #304156;
  color: #fff;
  overflow: hidden;
}

.admin-logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.admin-logo h2 {
  margin: 0 0 5px 0;
  font-size: 20px;
  color: #fff;
}

.admin-logo p {
  margin: 0;
  font-size: 12px;
  color: #a0a8bb;
}

.admin-menu {
  border-right: none;
}

.admin-menu .el-menu-item {
  color: #bfcbd9;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.admin-menu .el-menu-item:hover,
.admin-menu .el-menu-item.is-active {
  background-color: #263445;
  color: #409EFF;
}

.admin-header {
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin: 0 8px;
  font-size: 14px;
  color: #606266;
}

.admin-main {
  background-color: #f5f5f5;
  padding: 20px;
  overflow-y: auto;
}
</style>