<template>
  <div class="page-container">
    <div class="card-container">
      <h1 class="page-title">fu wuConnectivityTest</h1>
      <p class="section-title">TestqianBackendAPIjie kouConnectivity</p>
      
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <!-- ji chuConnectivityTest -->
        <el-tab-pane label="ji chuConnectivity" name="basic">
          <div style="margin-bottom: 20px;">
            <el-button 
              type="primary" 
              @click="testBasicConnectivity" 
              :loading="loading.basic"
            >
              Testji chuConnectivity
            </el-button>
          </div>
          
          <div v-if="result.basic" class="test-result">
            <el-alert
              :title="result.basic.success ? 'lian jieSucceeded' : 'lian jieFailed'"
              :type="result.basic.success ? 'success' : 'error'"
              :description="result.basic.message"
              show-icon
              :closable="false"
            />
            
            <div v-if="result.basic.data" style="margin-top: 20px;">
              <h4>xiang ying shu ju:</h4>
              <el-scrollbar height="200px">
                <pre>{{ JSON.stringify(result.basic.data, null, 2) }}</pre>
              </el-scrollbar>
            </div>
          </div>
        </el-tab-pane>
        
        <!-- DatabaseConnectivityTest -->
        <el-tab-pane label="DatabaseConnectivity" name="database">
          <div style="margin-bottom: 20px;">
            <el-button 
              type="primary" 
              @click="testDatabaseConnectivity" 
              :loading="loading.database"
            >
              TestDatabaseConnectivity
            </el-button>
          </div>
          
          <div v-if="result.database" class="test-result">
            <el-alert
              :title="result.database.success ? 'Databaselian jieSucceeded' : 'Databaselian jieFailed'"
              :type="result.database.success ? 'success' : 'error'"
              :description="result.database.message"
              show-icon
              :closable="false"
            />
            
            <div v-if="result.database.data" style="margin-top: 20px;">
              <h4>DatabasebiaoInfo:</h4>
              <el-table :data="formatTableData(result.database.data.tables)" style="width: 100%">
                <el-table-column prop="table" label="biao ming" />
                <el-table-column prop="count" label="ji lu shu" />
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        
        <!-- UserLoginTest -->
        <el-tab-pane label="UserLogin" name="login">
          <div style="margin-bottom: 20px;">
            <el-form :model="loginForm" label-width="80px">
              <el-form-item label="Username">
                <el-input v-model="loginForm.username" placeholder="qing shu ruUsername" />
              </el-form-item>
              <el-form-item label="Password">
                <el-input v-model="loginForm.password" type="password" placeholder="qing shu ruPassword" />
              </el-form-item>
              <el-form-item label="Userlei xing">
                <el-select v-model="loginForm.type" placeholder="qing xuan zeUserlei xing">
                  <el-option label="pu tongUser" value="user" />
                  <el-option label="Admin" value="admin" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button 
                  type="primary" 
                  @click="testUserLogin" 
                  :loading="loading.login"
                >
                  TestLogin
                </el-button>
                <el-button @click="fillTestCredentials">tian chongTestzhang hao</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <div v-if="result.login" class="test-result">
            <el-alert
              :title="result.login.success ? 'LoginSucceeded' : 'LoginFailed'"
              :type="result.login.success ? 'success' : 'error'"
              :description="result.login.message"
              show-icon
              :closable="false"
            />
            
            <div v-if="result.login.data" style="margin-top: 20px;">
              <h4>Loginxiang ying:</h4>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="UserID">{{ result.login.data.userId }}</el-descriptions-item>
                <el-descriptions-item label="Userlei xing">{{ result.login.data.userType }}</el-descriptions-item>
                <el-descriptions-item label="Token">{{ result.login.data.token ? 'yi huo qu' : 'wei huo qu' }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </el-tab-pane>
        
        <!-- Userjie kouTest -->
        <el-tab-pane label="Userjie kou" name="user" :disabled="!isUserLoggedIn">
          <div style="margin-bottom: 20px;">
            <el-alert
              title="Please log in firsthouTestUserjie kou"
              type="info"
              show-icon
              :closable="false"
              v-if="!isUserLoggedIn"
            />
            <el-button 
              v-else
              type="primary" 
              @click="testUserAPI" 
              :loading="loading.user"
            >
              TestUserjie kou
            </el-button>
          </div>
          
          <div v-if="result.user" class="test-result">
            <el-alert
              :title="result.user.success ? 'Userjie kouTestSucceeded' : 'Userjie kouTestFailed'"
              :type="result.user.success ? 'success' : 'error'"
              :description="result.user.message"
              show-icon
              :closable="false"
            />
            
            <div v-if="result.user.data" style="margin-top: 20px;">
              <h4>UserInfo:</h4>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="ID">{{ result.user.data.id }}</el-descriptions-item>
                <el-descriptions-item label="Username">{{ result.user.data.username }}</el-descriptions-item>
                <el-descriptions-item label="Points">{{ result.user.data.points }}</el-descriptions-item>
                <el-descriptions-item label="Role">{{ result.user.data.role }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </el-tab-pane>
        
        <!-- Adminjie kouTest -->
        <el-tab-pane label="Adminjie kou" name="admin" :disabled="!isAdminLoggedIn">
          <div style="margin-bottom: 20px;">
            <el-alert
              title="qing xian yiAdminshen fenLoginhouTestAdminjie kou"
              type="info"
              show-icon
              :closable="false"
              v-if="!isAdminLoggedIn"
            />
            <div v-else>
              <el-button 
                type="primary" 
                @click="testAdminAPI" 
                :loading="loading.admin"
                style="margin-right: 10px;"
              >
                TestAdminjie kou
              </el-button>
              <el-button 
                type="primary" 
                @click="testSystemStatus" 
                :loading="loading.system"
              >
                TestSystemStatus
              </el-button>
            </div>
          </div>
          
          <div v-if="result.admin" class="test-result">
            <el-alert
              :title="result.admin.success ? 'Adminjie kouTestSucceeded' : 'Adminjie kouTestFailed'"
              :type="result.admin.success ? 'success' : 'error'"
              :description="result.admin.message"
              show-icon
              :closable="false"
            />
          </div>
          
          <div v-if="result.system" class="test-result">
            <el-alert
              :title="result.system.success ? 'SystemStatushuo quSucceeded' : 'SystemStatushuo quFailed'"
              :type="result.system.success ? 'success' : 'error'"
              :description="result.system.message"
              show-icon
              :closable="false"
            />
            
            <div v-if="result.system.data" style="margin-top: 20px;">
              <h4>SystemStatus:</h4>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="Status">{{ result.system.data.system.status }}</el-descriptions-item>
                <el-descriptions-item label="ban ben">{{ result.system.data.system.version }}</el-descriptions-item>
                <el-descriptions-item label="Admin">{{ result.system.data.admin }}</el-descriptions-item>
                <el-descriptions-item label="shi jian">{{ result.system.data.system.timestamp }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </el-tab-pane>
        
        <!-- TestProductjie kou -->
        <el-tab-pane label="TestProductjie kou" name="products" :disabled="!isUserLoggedIn">
          <div style="margin-bottom: 20px;">
            <el-alert
              title="Please log in firsthouTestProductjie kou"
              type="info"
              show-icon
              :closable="false"
              v-if="!isUserLoggedIn"
            />
            <el-button 
              v-else
              type="primary" 
              @click="testProductsAPI" 
              :loading="loading.products"
            >
              TestProductjie kou
            </el-button>
          </div>
          
          <div v-if="result.products" class="test-result">
            <el-alert
              :title="result.products.success ? 'Productjie kouTestSucceeded' : 'Productjie kouTestFailed'"
              :type="result.products.success ? 'success' : 'error'"
              :description="result.products.message"
              show-icon
              :closable="false"
            />
            
            <div v-if="result.products.data && result.products.data.products" style="margin-top: 20px;">
              <h4>TestProductList:</h4>
              <el-table :data="result.products.data.products" style="width: 100%">
                <el-table-column prop="id" label="ID" width="60" />
                <el-table-column prop="name" label="Productming cheng" />
                <el-table-column prop="pointsRequired" label="suo xuPoints" width="120" />
                <el-table-column prop="stock" label="Stock" width="80" />
                <el-table-column prop="status" label="Status" width="80" />
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      
      <div style="margin-top: 30px;">
        <el-button @click="$router.push('/')">fan huiHome</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { apiHealth, apiAuth, apiUser, apiAdmin } from '@/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// dang qian ji huo de biao qian ye
const activeTab = ref('basic')

// jia zaiStatus
const loading = reactive({
  basic: false,
  database: false,
  login: false,
  user: false,
  admin: false,
  system: false,
  products: false
})

// Testjie guo
const result = reactive({
  basic: null,
  database: null,
  login: null,
  user: null,
  admin: null,
  system: null,
  products: null
})

// Loginbiao dan
const loginForm = reactive({
  username: '',
  password: '',
  type: 'user'
})

// ji suan shu xing
const isUserLoggedIn = computed(() => authStore.isAuthenticated)
const isAdminLoggedIn = computed(() => authStore.isAuthenticated && authStore.isAdmin)

// biao qian ye qie huan chu li
const handleTabClick = () => {
  // ke yi zai qie huan shi zhi xing yi xie luo ji
}

// Testji chuConnectivity
const testBasicConnectivity = async () => {
  loading.basic = true
  result.basic = null
  
  try {
    const response = await apiHealth.check()
    result.basic = {
      success: true,
      message: response.message,
      data: response
    }
    ElMessage.success('ji chuConnectivityTestSucceeded')
  } catch (error) {
    result.basic = {
      success: false,
      message: error.message || 'ji chuConnectivityTestFailed',
      data: null
    }
    ElMessage.error('ji chuConnectivityTestFailed')
  } finally {
    loading.basic = false
  }
}

// TestDatabaseConnectivity
const testDatabaseConnectivity = async () => {
  loading.database = true
  result.database = null
  
  try {
    const response = await apiHealth.checkDatabase()
    result.database = {
      success: true,
      message: response.message,
      data: response
    }
    ElMessage.success('DatabaseConnectivityTestSucceeded')
  } catch (error) {
    result.database = {
      success: false,
      message: error.message || 'DatabaseConnectivityTestFailed',
      data: null
    }
    ElMessage.error('DatabaseConnectivityTestFailed')
  } finally {
    loading.database = false
  }
}

// TestUserLogin
const testUserLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning('qing shu ruUsernamehePassword')
    return
  }
  
  loading.login = true
  result.login = null
  
  try {
    const response = await apiAuth.login(
      loginForm.username,
      loginForm.password,
      loginForm.type
    )
    
    // bao cunLoginStatus
    authStore.setAuth({
      token: response.token,
      userId: response.userId,
      username: loginForm.username,
      userType: response.userType
    })
    
    result.login = {
      success: true,
      message: response.message || 'LoginSucceeded',
      data: response
    }
    ElMessage.success('LoginTestSucceeded')
  } catch (error) {
    result.login = {
      success: false,
      message: error.message || 'LoginTestFailed',
      data: null
    }
    ElMessage.error('LoginTestFailed')
  } finally {
    loading.login = false
  }
}

// tian chongTestzhang hao
const fillTestCredentials = () => {
  if (loginForm.type === 'user') {
    loginForm.username = 'user1'
    loginForm.password = 'password1'
  } else {
    loginForm.username = 'admin'
    loginForm.password = 'admin123'
  }
}

// TestUserjie kou
const testUserAPI = async () => {
  loading.user = true
  result.user = null
  
  try {
    const response = await apiUser.getProfile()
    result.user = {
      success: true,
      message: 'UserInfohuo quSucceeded',
      data: response.data
    }
    ElMessage.success('Userjie kouTestSucceeded')
  } catch (error) {
    result.user = {
      success: false,
      message: error.message || 'Userjie kouTestFailed',
      data: null
    }
    ElMessage.error('Userjie kouTestFailed')
  } finally {
    loading.user = false
  }
}

// TestAdminjie kou
const testAdminAPI = async () => {
  loading.admin = true
  result.admin = null
  
  try {
    const response = await apiAdmin.test()
    result.admin = {
      success: true,
      message: response.message || 'Adminjie kouTestSucceeded',
      data: response
    }
    ElMessage.success('Adminjie kouTestSucceeded')
  } catch (error) {
    result.admin = {
      success: false,
      message: error.message || 'Adminjie kouTestFailed',
      data: null
    }
    ElMessage.error('Adminjie kouTestFailed')
  } finally {
    loading.admin = false
  }
}

// TestSystemStatus
const testSystemStatus = async () => {
  loading.system = true
  result.system = null
  
  try {
    const response = await apiAdmin.getSystemStatus()
    result.system = {
      success: true,
      message: response.message || 'SystemStatushuo quSucceeded',
      data: response
    }
    ElMessage.success('SystemStatusTestSucceeded')
  } catch (error) {
    result.system = {
      success: false,
      message: error.message || 'SystemStatusTestFailed',
      data: null
    }
    ElMessage.error('SystemStatusTestFailed')
  } finally {
    loading.system = false
  }
}

// TestProductjie kou
const testProductsAPI = async () => {
  loading.products = true
  result.products = null
  
  try {
    const response = await apiUser.getTestProducts()
    result.products = {
      success: true,
      message: 'TestProductListhuo quSucceeded',
      data: response.data
    }
    ElMessage.success('Productjie kouTestSucceeded')
  } catch (error) {
    result.products = {
      success: false,
      message: error.message || 'Productjie kouTestFailed',
      data: null
    }
    ElMessage.error('Productjie kouTestFailed')
  } finally {
    loading.products = false
  }
}

// ge shi hua biao ge shu ju
const formatTableData = (tables) => {
  return Object.entries(tables).map(([table, count]) => ({
    table,
    count
  }))
}
</script>

<style scoped>
.test-result {
  margin-top: 20px;
}

pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>