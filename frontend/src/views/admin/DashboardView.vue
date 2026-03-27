<template>
  <AdminLayout>
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>
    
    <div v-else class="dashboard-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card class="dashboard-card">
              <template #header>
                <div class="card-header">
                  <span>SystemInfo</span>
                </div>
              </template>
              <div class="card-content">
                <div class="info-item">
                  <span class="info-label">Status:</span>
                  <el-tag type="success">{{ systemInfo.status }}</el-tag>
                </div>
                <div class="info-item">
                  <span class="info-label">ban ben:</span>
                  <span>{{ systemInfo.version }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Updateshi jian:</span>
                  <span>{{ formatDate(systemInfo.timestamp) }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="8">
            <el-card class="dashboard-card">
              <template #header>
                <div class="card-header">
                  <span>AdminInfo</span>
                </div>
              </template>
              <div class="card-content">
                <div class="info-item">
                  <span class="info-label">Username:</span>
                  <span>{{ userInfo.username }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">ID:</span>
                  <span>{{ userInfo.id }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Role:</span>
                  <el-tag type="warning">Admin</el-tag>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <el-col :span="8">
            <el-card class="dashboard-card">
              <template #header>
                <div class="card-header">
                  <span>kuai su cao zuo</span>
                </div>
              </template>
              <div class="card-content">
                <div class="quick-actions">
                  <el-button type="primary" @click="testConnection">
                    ConnectivityTest
                  </el-button>
                  <el-button type="success" @click="checkSystemStatus">
                    jian chaSystemStatus
                  </el-button>
                  <el-button @click="$router.push('/')">
                    fan huiHome
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="24">
            <el-card class="dashboard-card">
              <template #header>
                <div class="card-header">
                  <span>Systemxiao xi</span>
                </div>
              </template>
              <div class="card-content">
                <el-alert 
                  title="huan ying shi yongAdminSystem" 
                  type="success" 
                  :closable="false"
                  show-icon
                >
                  <template #default>
                    <p>nin yiSucceededLoginAdminSystem，ke yi guan liProduct、OrderheUser。</p>
                  </template>
                </el-alert>
              </div>
            </el-card>
          </el-col>
        </el-row>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { apiAdmin, apiAuth, apiHealth } from '@/api';
import { useAuthStore } from '@/stores/auth';
import AdminLayout from '@/components/layout/AdminLayout.vue';

const router = useRouter();
const authStore = useAuthStore();

// jia zaiStatus
const loading = ref(true);

// SystemInfo
const systemInfo = ref({
  status: 'running',
  version: '1.0.0',
  timestamp: null
});

// UserInfo
const userInfo = ref({});

// huo quAdminInfo
const getAdminInfo = async () => {
  try {
    // congauthStorehuo quUserInfo
    userInfo.value = authStore.user || {};
    
    // huo quSystemStatus
    const systemStatus = await apiAdmin.getSystemStatus();
    if (systemStatus.success) {
      systemInfo.value = {
        ...systemInfo.value,
        ...systemStatus.system
      };
    }
  } catch (error) {
    console.error('huo quAdminInfoFailed:', error);
  } finally {
    loading.value = false;
  }
};



// ConnectivityTest
const testConnection = () => {
  router.push('/connectivity-test');
};

// jian chaSystemStatus
const checkSystemStatus = async () => {
  try {
    const response = await apiHealth.check();
    if (response.success) {
      ElMessage.success('SystemStatuszheng chang');
    } else {
      ElMessage.warning('SystemStatusException');
    }
  } catch (error) {
    console.error('jian chaSystemStatusFailed:', error);
    ElMessage.error('wu fa huo quSystemStatus');
  }
};

// ge shi hua ri qi
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString();
};

// zu jian gua zai shi huo quInfo
onMounted(() => {
  getAdminInfo();
});
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.loading-container {
  padding: 20px;
}

.dashboard-content {
  margin-top: 20px;
}

.dashboard-card {
  height: 100%;
}

.card-header {
  font-weight: bold;
}

.card-content {
  padding: 10px 0;
}

.info-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.info-label {
  font-weight: bold;
  margin-right: 10px;
  min-width: 70px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>