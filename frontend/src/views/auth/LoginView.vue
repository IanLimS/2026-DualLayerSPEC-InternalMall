<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">{{ pageTitle }}</h1>
        <div class="login-type-toggle">
          <el-button 
            :type="loginType === 'user' ? 'primary' : 'default'"
            @click="switchLoginType('user')"
          >
            UserLogin
          </el-button>
          <el-button 
            :type="loginType === 'admin' ? 'primary' : 'default'"
            @click="switchLoginType('admin')"
          >
            AdminLogin
          </el-button>
        </div>
      </div>

      <el-form 
        ref="loginFormRef" 
        :model="loginForm" 
        :rules="loginRules" 
        label-width="80px"
        class="login-form"
      >
        <el-form-item label="Username" prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="qing shu ruUsername"
            @keyup.enter="handleLogin"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="Password" prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="qing shu ruPassword"
            show-password
            @keyup.enter="handleLogin"
          ></el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            :loading="loading" 
            @click="handleLogin"
            class="login-button"
          >
            {{ loading ? 'Loginzhong...' : 'Login' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="test-account-tips" v-if="showTestAccounts">
        <p>Testzhang hao：</p>
        <div v-if="loginType === 'user'">
          <p>user1/password1 (100Points)</p>
          <p>user2/password2 (200Points)</p>
          <p>user3/password3 (150Points)</p>
        </div>
        <div v-else>
          <p>admin/admin123</p>
        </div>
        <el-button 
          size="small" 
          type="text" 
          @click="fillTestAccount"
        >
          Quick FillTestzhang hao
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { apiAuth } from '@/api';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// biao dan yin yong
const loginFormRef = ref(null);
// jia zaiStatus
const loading = ref(false);
// shi fou xian shiTestzhang hao
const showTestAccounts = ref(true);

// Loginlei xing，mo ren congURLcan shu huo qu，fou ze mo ren weiuser
const loginType = ref(route.query.type || 'user');

// ye mian biao ti
const pageTitle = computed(() => {
  return loginType.value === 'admin' ? 'AdminLogin' : 'UserLogin';
});

// Loginbiao dan
const loginForm = ref({
  username: '',
  password: ''
});

// biao dan yan zheng gui ze
const loginRules = {
  username: [
    { required: true, message: 'qing shu ruUsername', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'qing shu ruPassword', trigger: 'blur' },
    { min: 6, message: 'Passwordchang du bu neng shao yu6wei', trigger: 'blur' }
  ]
};

// qie huanLoginlei xing
const switchLoginType = (type) => {
  loginType.value = type;
  loginForm.value = { username: '', password: '' };
  // UpdateURLcan shu dan bu chu fa lu you bian hua
  router.replace({ query: { type } });
};

// chu liLogin
const handleLogin = async () => {
  if (!loginFormRef.value) return;
  
  // biao dan yan zheng
  const valid = await loginFormRef.value.validate().catch(() => false);
  if (!valid) return;
  
  loading.value = true;
  
  try {
    const response = await apiAuth.login(
      loginForm.value.username,
      loginForm.value.password,
      loginType.value
    );
    
    if (response.success) {
      // bao cun ren zhengInfo
      authStore.setAuth({
        token: response.token,
        userId: response.userId,
        username: loginForm.value.username,
        userType: response.userType
      });
      
      ElMessage.success(response.message || 'LoginSucceeded');
      
      // gen juUserlei xing tiao zhuan dao bu tong ye mian
      if (response.userType === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/products');
      }
    }
  } catch (error) {
    // Erroryi zaiAPIlan jie qi zhong chu li，zhe li ke yi tian jia e wai deErrorchu li
    console.error('LoginFailed:', error);
    
    // ru guo shi wang luoErrorhuo lan jie qi wei chu li deError，xian shi tong yongErrorti shi
    if (!error.response) {
      ElMessage.error('LoginFailed，qing jian cha wang luo lian jie');
    }
  } finally {
    loading.value = false;
  }
};

// tian chongTestzhang hao
const fillTestAccount = () => {
  if (loginType.value === 'user') {
    loginForm.value.username = 'user1';
    loginForm.value.password = 'password1';
  } else {
    loginForm.value.username = 'admin';
    loginForm.value.password = 'admin123';
  }
};

// zu jian gua zai shi chu li
onMounted(() => {
  // ru guoURLzhong mei youtypecan shu，Settingswei mo ren zhi
  if (!route.query.type) {
    router.replace({ query: { type: loginType.value } });
  }
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  padding: 30px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.login-type-toggle {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.login-form {
  margin-top: 20px;
}

.login-button {
  width: 100%;
  height: 40px;
}

.test-account-tips {
  margin-top: 25px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
}

.test-account-tips p {
  margin: 5px 0;
}
</style>