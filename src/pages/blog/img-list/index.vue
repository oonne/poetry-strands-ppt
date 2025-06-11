<template>
  <div class="app-view-header">
    <a-space>
      <a-upload
        :show-upload-list="false"
        name="file"
        :custom-request="onUpload"
        accept=".jpg,.jpeg,.png,.gif,.webp"
      >
        <a-button
          type="primary"
          :loading="uploading"
        >
          上传图片
        </a-button>
      </a-upload>
    </a-space>

    <div class="app-view-header-sum">
      总计: {{ pagination.total }}
    </div>
  </div>

  <!-- 表格 -->
  <a-table
    :data-source="dataList"
    :columns="columns"
    :loading="loading"
    row-key="id"
    :row-class-name="rowClassName"
    :pagination="pagination"
    @resize-column="onResizeColumn"
    @change="changeTable"
  >
    <template
      #customFilterDropdown="{
        setSelectedKeys,
        selectedKeys,
        confirm,
        column
      }"
    >
      <div class="table-filter-dropdown">
        <!-- 搜索 -->
        <template v-if="column.key === 'fileName' || column.key === 'fileSize'">
          <a-input-search
            :value="selectedKeys[0]"
            size="small"
            allow-clear
            @change="(e: any) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @search="confirm"
          />
        </template>
      </div>
    </template>

    <!-- 显示当前的搜索条件 -->
    <template #headerCell="{ column }">
      <template v-if="column.key === 'fileName' && filters.fileName">
        文件名({{ filters.fileName[0] }})
      </template>
    </template>

    <template #bodyCell="{ column, record, index }">
      <!-- 序号 -->
      <template v-if="column.key === 'index'">
        {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
      </template>

      <!-- 图片预览 -->
      <template v-if="column.key === 'preview'">
        <a-image
          :width="150"
          :src="`${VITE_FILE_URL}/${record.fileName}`"
        />
      </template>

      <!-- 文件名 -->
      <template v-if="column.key === 'fileName'">
        <a-flex
          align="center"
          gap="small"
        >
          <span>{{ record.fileName }}</span>
          <Icon
            icon="copy"
            class="copy-icon"
            @click="copyText(`${VITE_FILE_URL}/${record.fileName}`)"
          />
        </a-flex>
      </template>

      <!-- 文件大小 -->
      <template v-if="column.key === 'fileSize'">
        {{ getFileSize(record.fileSize) }}
      </template>

      <!-- 更新时间 -->
      <template v-if="column.key === 'updatedAt'">
        {{ dayjs(record.updatedAt).format('YYYY-MM-DD HH:mm:ss') || '-' }}
      </template>

      <!-- 操作 -->
      <template v-if="column.key === 'operation'">
        <a-button
          size="small"
          type="link"
          danger
          @click="onDelete(record)"
        >
          删除
        </a-button>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message, TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import useTable from '@/hooks/use-table';
import { fileApi } from '@/api/index';
import {
  buildErrorMsg, Feedback, Common,
} from '@/utils/index';
import Icon from '@/components/icon-svg/index.vue';
import type { IFile } from '@/types/file';
import type { IUploadEvent } from '@/types/index';

const { VITE_FILE_URL } = import.meta.env;
const { confirmModal, copyText } = Feedback;
const { getFileSize } = Common;

/*
 * 列表项
 */
const columns = ref<TableColumnsType>([
  {
    title: '#',
    key: 'index',
    width: 50,
  },
  {
    title: '预览',
    key: 'preview',
    width: 150,
  },
  {
    title: '文件名',
    key: 'fileName',
    sorter: true,
    customFilterDropdown: true,
    resizable: true,
    width: 200,
  },
  {
    title: '文件大小',
    key: 'fileSize',
    sorter: true,
    customFilterDropdown: true,
    resizable: true,
    width: 150,
  },
  {
    title: '更新时间',
    key: 'updatedAt',
    sorter: true,
    resizable: true,
    width: 150,
  },
  {
    title: '操作',
    key: 'operation',
    resizable: true,
    width: 150,
  },
]);

/*
 * 列表
 */
const dataList = ref<IFile[]>([]);
const {
  loading,
  setGetDataFunction,
  pagination,
  filters,
  sorter,
  changeTable,
  onResizeColumn,
  rowClassName,
} = useTable();

/*
 * 获取数据
 */
const getList = async () => {
  loading.value = true;
  const params: any = {
    pageNo: pagination.value.current,
    pageSize: pagination.value.pageSize,
  };
  if (filters.value.fileName) {
    [params.fileName] = filters.value.fileName;
  }
  if (filters.value.fileSize) {
    [params.fileSize] = filters.value.fileSize;
  }
  if (sorter.value.columnKey) {
    params.sortField = sorter.value.columnKey;
    params.sortOrder = sorter.value.order === 'ascend' ? 'asc' : 'desc';
  }

  const [err, res] = await fileApi.getList(params);
  loading.value = false;

  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '查询失败' }));
    return;
  }

  dataList.value = res.data.list;
  pagination.value.total = res.data.total;
  pagination.value.current = res.data.pageNo;
};
setGetDataFunction(getList);

/*
 * 进入页面
 */
onMounted(() => {
  getList();
});

/*
 * 删除
 */
const onDelete = async (record: IFile) => {
  const confirm = await confirmModal({
    title: '删除',
    content: '确定删除吗？',
  });

  if (!confirm) {
    return;
  }

  const [err] = await fileApi.deleteFile({ fileId: record.fileId });
  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '删除失败' }));
    return;
  }

  message.success('删除成功');
  getList();
};

/*
 * 上传
 */
const uploading = ref(false);

const onUpload = async (event: IUploadEvent) => {
  if (uploading.value) {
    return;
  }

  uploading.value = true;
  const [err] = await fileApi.upload({ file: event.file, type: 'img' });
  uploading.value = false;

  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '上传失败' }));
    return;
  }

  message.success('上传成功');
  getList();
};

</script>

<style scoped>
</style>
