<template>
  <div class="app-form">
    <a-form
      ref="formRef"
      :model="formData"
      layout="vertical"
      hide-required-mark
    >
      <a-form-item
        label="标题"
      >
        {{ formData.title }}
      </a-form-item>

      <a-form-item label="HTML源码">
        <a-textarea
          v-model:value="formData.content"
          placeholder="请输入HTML"
          :auto-size="{ minRows: 3, maxRows: 10 }"
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
import { blogApi } from '@/api/index';
import { to, buildErrorMsg } from '@/utils/index';
import type { IBlog } from '@/types/blog';

const route = useRoute();
const router = useRouter();

/* 表单 */
const formRef = ref();
const formData = ref<IBlog>({
  blogId: '',
  title: '',
  publishDate: '',
  content: '',
  linkUrl: '',
  isActive: true,
  description: '',
  keywords: '',
});

/* 查询详情 */
const getDetail = async () => {
  if (!route.query.blogId) {
    message.error('查无博客');
    return;
  }

  const [err, res] = await blogApi.getDetail({ blogId: route.query.blogId });
  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '查询失败' }));
    return;
  }
  formData.value = {
    ...res.data,
  };
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
  const [err] = await blogApi.updateBlog(formData.value);
  loading.value = false;

  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '提交失败' }));
    return;
  }

  message.success('提交成功');
  router.back();
};
</script>

<style scoped>
.app-form {
  max-width: 800px;
}
</style>
