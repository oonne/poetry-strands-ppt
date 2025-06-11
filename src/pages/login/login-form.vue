<template>
  <div class="login-page">
    <div class="login-container">
      <a-form
        ref="formRef"
        :model="formState"
        name="login"
        @finish="onLogin"
      >
        <a-form-item
          name="name"
          :rules="[{ required: true, message: '请输入账号名!' }]"
        >
          <a-input
            v-model:value="formState.name"
            placeholder="账号名"
          />
        </a-form-item>

        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password
            v-model:value="formState.password"
            placeholder="密码"
          />
        </a-form-item>

        <a-button
          type="primary"
          html-type="submit"
          class="login-button"
          :loading="loading"
        >
          登录
        </a-button>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import CryptoJS from 'crypto-js';
import { authApi } from '@/api/index';
import config from '@/config/index';
import { useStaffStore } from '@/store/index';
import { to, buildErrorMsg, Utils } from '@/utils/index';

const { createHash, randomChars } = Utils;
const staffStore = useStaffStore();
const router = useRouter();

/*
 * 表单
 */
const formRef = ref();
const formState = ref({
  name: '',
  password: '',
});
const loading = ref(false);

/*
 * 初始化
 */
const initSystem = async () => {
  loading.value = true;
  const [err] = await authApi.init();
  loading.value = false;
  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '初始化失败' }));
    return;
  }

  message.success('初始化成功');
};

/*
 * 计算登录pow
 */
const calcLoginPow = async (name: string) => {
  const [err, res] = await authApi.getLoginPow({
    name,
  });
  if (err) {
    return '';
  }

  const { salt, result } = res.data;
  if (!salt || !result) {
    return '';
  }

  let powKey = '';

  // eslint-disable-next-line no-constant-condition
  while (true) {
    powKey = randomChars(32);
    const hash = CryptoJS.SHA512(powKey + salt).toString();

    if (hash.slice(-config.loginPowLength) === result.slice(-config.loginPowLength)) {
      break;
    }
  }
  return powKey;
};

/*
 * 登录
 */
const onLogin = async () => {
  if (loading.value) {
    return;
  }

  const [validateErr] = await to(formRef.value?.validate());
  if (validateErr) {
    return;
  }

  // 如果账号名和密码都是 init，则初始化系统
  if (formState.value.name === 'init' && formState.value.password === 'init') {
    await initSystem();
    return;
  }

  // 登录逻辑
  loading.value = true;
  console.time('pow耗时');
  const powKey = await calcLoginPow(formState.value.name);
  console.timeEnd('pow耗时');

  if (!powKey) {
    loading.value = false;
    message.error(buildErrorMsg({ err: '登录失败', defaultMsg: '登录失败' }));
    return;
  }

  const [err, res] = await authApi.login({
    powKey,
    name: formState.value.name,
    password: createHash(formState.value.password, 32),
  });
  loading.value = false;

  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '登录失败' }));
    return;
  }

  const { staff, token, refreshToken } = res.data;
  localStorage.setItem('TOKEN', token);
  localStorage.setItem('REFRESH_TOKEN', refreshToken);
  staffStore.setStaffInfo(staff);
  staffStore.setTokenRefreshTime();

  message.success('登录成功');
  router.replace({
    name: 'home',
  });
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
}

.login-container {
  width: 300px;
  padding: 24px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.login-button {
  width: 100%;
}
</style>
