<template>
  <div class="page-container">
    <div class="card-container">
      <h1 class="page-title">Internal Employee Benefits Mall</h1>
      <p>huan ying shi yongInternal Employee Benefits MallSystem！</p>
      <div class="button-group">
        <el-button type="success" @click="goToUserLogin">
          UserLogin
        </el-button>
        <el-button type="warning" @click="goToAdminLogin">
          AdminLogin
        </el-button>
        <el-button type="info" @click="$router.push('/connectivity-test')">
          fu wuConnectivityTest
        </el-button>
      </div>
      <div class="account-tips">
        <p>Testzhang hao：</p>
        <p>Userzhang hao：user1/password1, user2/password2, user3/password3</p>
        <p>Adminzhang hao：admin/admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// tiao zhuan daoUserLoginye mian
const goToUserLogin = () => {
  router.push({
    path: '/login',
    query: { type: 'user' }
  });
};

// tiao zhuan daoAdminLoginye mian
const goToAdminLogin = () => {
  router.push({
    path: '/login',
    query: { type: 'admin' }
  });
};
</script>

<style scoped>
.button-group {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.account-tips {
  margin-top: 30px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
}

.account-tips p {
  margin: 5px 0;
}
</style>