<template>
  <div class="app-form">
    <a-form
      ref="formRef"
      :model="formData"
      layout="vertical"
      hide-required-mark
    >
      <a-form-item
        label="账号名"
        name="name"
        :rules="[{ required: true }]"
      >
        <a-input
          v-model:value="formData.name"
          placeholder="请输入账号名"
        />
      </a-form-item>

      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: !formData.staffId }]"
      >
        <a-input
          v-model:value="formData.password"
          placeholder="请输入密码"
        />
      </a-form-item>

      <a-form-item label="角色">
        <a-select v-model:value="formData.role">
          <a-select-option
            v-for="item in roleList"
            :key="item.type"
            :value="item.type"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="是否启用">
        <a-switch v-model:checked="formData.isActive" />
      </a-form-item>

      <a-button
        type="primary"
        :loading="loading"
        @click="onSubmit"
      >
        保存
      </a-button>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import { emit as busEmit } from 'eventbus-typescript';
import { staffApi } from '@/api/index';
import { useStaffStore } from '@/store/index';
import { to, buildErrorMsg, Utils } from '@/utils/index';
import roleList from '@/constant/role';
import type { IStaff } from '@/types/staff';

const route = useRoute();
const router = useRouter();
const { createHash } = Utils;
const staffStore = useStaffStore();

/* 表单 */
const formRef = ref();
const formData = ref<IStaff>({
  staffId: '',
  name: '',
  password: '',
  role: 1,
  isActive: true,
});

/* 查询详情 */
const getDetail = async () => {
  if (!route.query.staffId) {
    busEmit('UPDATE_PAGE_TITLE', '新增账号');
    return;
  }

  const [err, res] = await staffApi.getDetail({ staffId: route.query.staffId });
  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '查询失败' }));
    return;
  }
  formData.value = res.data;
  busEmit('UPDATE_PAGE_TITLE', `编辑账号 - ${formData.value.name}`);
};

/* 进入页面 */
onMounted(async () => {
  getDetail();
});

/* 提交 */
const loading = ref(false);
const onSubmit = async () => {
  if (loading.value) {
    return;
  }

  const [validateErr] = await to(formRef.value?.validate());
  if (validateErr) {
    return;
  }

  // 密码需要哈希
  const params = {
    ...formData.value,
  };
  if (params.password) {
    params.password = createHash(params.password, 32);
  }

  // 如果是当前账号，则isActive必须是true
  if (formData.value.staffId === staffStore.staffInfo.staffId) {
    params.isActive = true;
  }

  loading.value = true;
  const [err] = await (
    formData.value.staffId
      ? staffApi.updateStaff(params)
      : staffApi.addStaff(params)
  );
  loading.value = false;

  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '提交失败' }));
    return;
  }

  message.success('提交成功');
  router.back();
};
</script>

<style scoped></style>
