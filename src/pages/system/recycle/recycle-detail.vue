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
      label="类型"
      :span="3"
    >
      {{ getRecycleTypeName(detail.type) }}
    </a-descriptions-item>
    <a-descriptions-item label="删除时间">
      {{ dayjs(detail.createdAt).format('YYYY-MM-DD HH:mm:ss') }}
    </a-descriptions-item>
    <a-descriptions-item label="操作者">
      {{ detail.deleteStaffName }}
    </a-descriptions-item>
    <a-descriptions-item label="操作者ID">
      {{ detail.deleteStaffId }}
    </a-descriptions-item>

    <a-descriptions-item label="内容">
      <TextContent :content="detail.content" />
    </a-descriptions-item>
  </a-descriptions>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { recycleApi } from '@/api/index';
import { buildErrorMsg } from '@/utils/index';
import Loading from '@/components/loading/index.vue';
import TextContent from '@/components/text-content/index';
import type { IRecycle } from '@/types/recycle';
import { getRecycleTypeName } from './recycle-utils';

const route = useRoute();

const detail = ref<IRecycle>({
  type: 1,
  recycleId: '',
  content: '',
});
const loading = ref(false);

/* 查询详情 */
const getDetail = async () => {
  if (!route.query.recycleId) {
    return;
  }

  loading.value = true;
  const [err, res] = await recycleApi.getDetail({ recycleId: route.query.recycleId });
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

<style scoped></style>
