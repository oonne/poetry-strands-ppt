<template>
  <Loading
    v-if="loading"
    class="app-detail-loading"
  />

  <a-descriptions
    v-else
    bordered
    :column="1"
  >
    <a-descriptions-item
      label="更新时间"
    >
      {{ dayjs(detail.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}
    </a-descriptions-item>
    <a-descriptions-item
      label="KEY"
    >
      {{ detail.key }}
    </a-descriptions-item>
    <a-descriptions-item
      label="VALUE"
    >
      <TextContent :content="detail.value" />
    </a-descriptions-item>
    <a-descriptions-item
      label="备注"
    >
      <TextContent :content="detail.remark" />
    </a-descriptions-item>
  </a-descriptions>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { settingApi } from '@/api/index';
import { buildErrorMsg } from '@/utils/index';
import Loading from '@/components/loading/index.vue';
import TextContent from '@/components/text-content/index';
import type { ISetting } from '@/types/setting';

const route = useRoute();

const detail = ref<ISetting>({
  settingId: '',
  key: '',
  value: '',
  remark: '',
});
const loading = ref(false);

/* 查询详情 */
const getDetail = async () => {
  if (!route.query.settingId) {
    return;
  }

  loading.value = true;
  const [err, res] = await settingApi.getDetail({ settingId: route.query.settingId });
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
