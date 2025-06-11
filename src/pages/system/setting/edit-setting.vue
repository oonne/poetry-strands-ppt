<template>
  <div class="app-form">
    <a-form
      ref="formRef"
      :model="formData"
      layout="vertical"
      hide-required-mark
    >
      <a-form-item
        label="KEY"
        name="key"
        :rules="[{ required: true }]"
      >
        <a-input
          v-model:value="formData.key"
          placeholder="请输入KEY"
        />
      </a-form-item>

      <a-form-item
        label="VALUE"
        name="value"
      >
        <a-textarea
          v-model:value="formData.value"
          placeholder="请输入VALUE"
          :auto-size="{ minRows: 3 }"
        />
      </a-form-item>

      <a-form-item
        label="备注"
        name="remark"
      >
        <a-textarea
          v-model:value="formData.remark"
          placeholder="请输入备注"
          :auto-size="{ minRows: 3 }"
        />
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
import { settingApi } from '@/api/index';
import { to, buildErrorMsg } from '@/utils/index';
import type { ISetting } from '@/types/setting';

const route = useRoute();
const router = useRouter();

/* 表单 */
const formRef = ref();
const formData = ref<ISetting>({
  settingId: '',
  key: '',
  value: '',
  remark: '',
});

/* 查询详情 */
const getDetail = async () => {
  if (!route.query.settingId) {
    busEmit('UPDATE_PAGE_TITLE', '新增系统配置');
    return;
  }

  const [err, res] = await settingApi.getDetail({ settingId: route.query.settingId });
  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '查询失败' }));
    return;
  }
  formData.value = res.data;
  busEmit('UPDATE_PAGE_TITLE', `编辑系统配置 - ${formData.value.key}`);
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

  loading.value = true;
  const [err] = await (
    formData.value.settingId
      ? settingApi.updateSetting(formData.value)
      : settingApi.addSetting(formData.value)
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
