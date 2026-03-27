<template>
  <div class="page-container">
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
          <router-link to="/user/favorites" class="nav-item">
            <el-icon><Star /></el-icon>
            <span>wo deFavorites</span>
          </router-link>
          <router-link to="/user/profile" class="nav-item active">
            <el-icon><User /></el-icon>
            <span>Profile</span>
          </router-link>
        </div>
      </div>
    </div>
    
    <div class="card-container">
      <div class="page-header">
        <h1 class="page-title">UserProfile</h1>
        <el-button type="danger" @click="handleLogout" :loading="logoutLoading">
          tui chuLogin
        </el-button>
      </div>
      
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>
      
      <div v-else class="profile-content">
        <el-descriptions title="ji benInfo" :column="1" border>
          <el-descriptions-item label="UserID">{{ userInfo.id }}</el-descriptions-item>
          <el-descriptions-item label="Username">{{ userInfo.username }}</el-descriptions-item>
          <el-descriptions-item label="Email">{{ userInfo.email || 'weiSettings' }}</el-descriptions-item>
          <el-descriptions-item label="shou ji">{{ userInfo.phone || 'weiSettings' }}</el-descriptions-item>
          <el-descriptions-item label="Points">{{ userInfo.points }}</el-descriptions-item>
          <el-descriptions-item label="Role">{{ userInfo.role === 'user' ? 'pu tongUser' : 'Admin' }}</el-descriptions-item>
          <el-descriptions-item label="Registration Time">{{ formatDate(userInfo.created_at) }}</el-descriptions-item>
        </el-descriptions>
        
        <div class="action-buttons">
          <el-button type="primary" @click="showEditDialog = true">
            Editzi liao
          </el-button>
          <el-button @click="$router.push('/')">
            fan huiHome
          </el-button>
        </div>
      </div>
      
      <!-- Editzi liao dui hua kuang -->
      <el-dialog 
        v-model="showEditDialog" 
        title="EditProfile" 
        width="400px"
        :before-close="handleCloseEditDialog"
      >
        <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="80px">
          <el-form-item label="Email" prop="email">
            <el-input v-model="editForm.email" placeholder="qing shu ruEmail"></el-input>
          </el-form-item>
          <el-form-item label="shou ji" prop="phone">
            <el-input v-model="editForm.phone" placeholder="qing shu ruPhone Number"></el-input>
          </el-form-item>
        </el-form>
        
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="handleCloseEditDialog">qu xiao</el-button>
            <el-button type="primary" @click="handleUpdateProfile" :loading="updateLoading">
              bao cun
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Shop, Star, User, ShoppingCart } from '@element-plus/icons-vue';
import { apiUser, apiAuth } from '@/api';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// jia zaiStatus
const loading = ref(true);
const logoutLoading = ref(false);
const updateLoading = ref(false);

// UserInfo
const userInfo = ref({});

// Editdui hua kuang
const showEditDialog = ref(false);
const editFormRef = ref(null);

// Editbiao dan
const editForm = ref({
  email: '',
  phone: ''
});

// biao dan yan zheng gui ze
const editRules = {
  email: [
    { type: 'email', message: 'qing shu ru zheng que deEmaildi zhi', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: 'qing shu ru zheng que dePhone Number', trigger: 'blur' }
  ]
};

// huo quUserInfo
const getUserInfo = async () => {
  try {
    const response = await apiUser.getProfile();
    if (response.success) {
      userInfo.value = response.data;
      editForm.value = {
        email: response.data.email || '',
        phone: response.data.phone || ''
      };
    }
  } catch (error) {
    console.error('huo quUserInfoFailed:', error);
  } finally {
    loading.value = false;
  }
};

// chu liLogout
const handleLogout = async () => {
  logoutLoading.value = true;
  try {
    await apiAuth.logout();
    ElMessage.success('yiSucceededtui chuLogin');
  } catch (error) {
    console.error('Logoutqing qiuFailed:', error);
    ElMessage.warning('yi qing chu ben diLoginInfo');
  } finally {
    logoutLoading.value = false;
    authStore.clearAuth();
    router.push('/');
  }
};

// guan biEditdui hua kuang
const handleCloseEditDialog = () => {
  showEditDialog.value = false;
  // zhong zhi biao dan shu ju
  editForm.value = {
    email: userInfo.value.email || '',
    phone: userInfo.value.phone || ''
  };
};

// UpdateProfile
const handleUpdateProfile = async () => {
  if (!editFormRef.value) return;
  
  const valid = await editFormRef.value.validate().catch(() => false);
  if (!valid) return;
  
  updateLoading.value = true;
  
  try {
    const response = await apiUser.updateProfile(editForm.value);
    if (response.success) {
      ElMessage.success('ProfileUpdateSucceeded');
      userInfo.value = { ...userInfo.value, ...response.data };
      showEditDialog.value = false;
    }
  } catch (error) {
    console.error('UpdateProfileFailed:', error);
  } finally {
    updateLoading.value = false;
  }
};

// ge shi hua ri qi
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString();
};

// zu jian gua zai shi huo quUserInfo
onMounted(() => {
  getUserInfo();
});
</script>

<style scoped>
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.loading-container {
  padding: 20px;
}

.profile-content {
  margin-top: 20px;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.dialog-footer {
  text-align: right;
}

@media (max-width: 768px) {
  .nav-list {
    flex-direction: column;
    gap: 8px;
  }
  
  .nav-item {
    padding: 12px 16px;
  }
}
</style>