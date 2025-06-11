<!-- eslint-disable vue/no-v-html -->
<template>
  <Loading
    v-if="loading"
    class="app-detail-loading"
  />

  <a-descriptions
    v-else
    bordered
  >
    <a-descriptions-item
      label="标题"
      :span="3"
    >
      {{ detail.title }}
    </a-descriptions-item>

    <a-descriptions-item label="发布日期">
      {{ dayjs(detail.publishDate).format('YYYY-MM-DD') }}
    </a-descriptions-item>
    <a-descriptions-item
      label="链接"
      :span="2"
    >
      <a-flex
        align="center"
        gap="small"
      >
        <a
          :href="`${VITE_BLOG_URL}/${detail.linkUrl}`"
          target="_blank"
        >
          {{ `${VITE_BLOG_URL}/${detail.linkUrl}` }}
        </a>
        <Icon
          icon="copy"
          class="copy-icon"
          @click="copyText(`${VITE_BLOG_URL}/${detail.linkUrl}`)"
        />
      </a-flex>
    </a-descriptions-item>

    <a-descriptions-item
      label="Description"
      :span="3"
    >
      {{ detail.description }}
    </a-descriptions-item>

    <a-descriptions-item
      label="Keywords"
      :span="3"
    >
      {{ detail.keywords }}
    </a-descriptions-item>

    <a-descriptions-item
      label="内容"
      :span="3"
    >
      <div
        class="blog-content"
        v-html="detail.content"
      />
    </a-descriptions-item>
  </a-descriptions>

  <!-- 内容TODO  -->
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { blogApi } from '@/api/index';
import { buildErrorMsg, Feedback } from '@/utils/index';
import Loading from '@/components/loading/index.vue';
import type { IBlog } from '@/types/blog';

const { VITE_BLOG_URL } = import.meta.env;
const route = useRoute();
const { copyText } = Feedback;

const detail = ref<IBlog>({
  blogId: '',
  title: '',
  publishDate: '',
  content: '',
  isActive: false,
  linkUrl: '',
  description: '',
  keywords: '',
});
const loading = ref(false);

/* 查询详情 */
const getDetail = async () => {
  if (!route.query.blogId) {
    return;
  }

  loading.value = true;
  const [err, res] = await blogApi.getDetail({ blogId: route.query.blogId });
  loading.value = false;

  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '查询失败' }));
    return;
  }

  detail.value = res.data;
};

/* 进入页面 */
onMounted(async () => {
  getDetail();
});
</script>

<style scoped>
.blog-content {
  max-width: 800px;
}
</style>
