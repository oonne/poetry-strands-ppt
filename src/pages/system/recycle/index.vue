<template>
  <div class="app-view-header">
    <div />
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
        <template v-if="column.key === 'content' || column.key === 'deleteStaffName'">
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
      <template v-if="column.key === 'type' && filters.type">
        类型({{ getRecycleTypeName(filters.type[0]) }})
      </template>
      <template v-if="column.key === 'content' && filters.content">
        内容({{ filters.content[0] }})
      </template>
      <template v-if="column.key === 'deleteStaffName' && filters.deleteStaffName">
        删除者({{ filters.deleteStaffName[0] }})
      </template>
    </template>

    <template #bodyCell="{ column, record, index }">
      <!-- 序号 -->
      <template v-if="column.key === 'index'">
        {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
      </template>

      <!-- 类型 -->
      <template v-if="column.key === 'type'">
        {{ getRecycleTypeName(record.type) }}
      </template>

      <!-- 内容 -->
      <template v-if="column.key === 'content'">
        <TextContent :content="record.content" />
      </template>

      <!-- 删除者 -->
      <template v-if="column.key === 'deleteStaffName'">
        {{ record.deleteStaffName || '-' }}
      </template>

      <!-- 删除时间 -->
      <template v-if="column.key === 'createdAt'">
        {{ dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss') || '-' }}
      </template>

      <!-- 操作 -->
      <template v-if="column.key === 'operation'">
        <a-button
          size="small"
          type="link"
          @click="routerJump($event, {
            name: 'recycle-detail',
            query: { recycleId: record.recycleId },
          })"
        >
          详情
        </a-button>
        <!-- 删除 -->
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
import { recycleApi } from '@/api/index';
import { buildErrorMsg, Feedback } from '@/utils/index';
import TextContent from '@/components/text-content/index';
import useLink from '@/hooks/use-link';
import type { IRecycle } from '@/types/recycle';
import { getRecycleTypeName, getRecycleTypeFilters } from './recycle-utils';

const { routerJump } = useLink();
const { confirmModal } = Feedback;

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
    title: '类型',
    key: 'type',
    sorter: true,
    filters: getRecycleTypeFilters(),
    resizable: true,
    width: 100,
  },
  {
    title: '内容',
    key: 'content',
    sorter: true,
    customFilterDropdown: true,
    resizable: true,
    width: 300,
  },
  {
    title: '删除者',
    key: 'deleteStaffName',
    sorter: true,
    customFilterDropdown: true,
    resizable: true,
    width: 100,
  },
  {
    title: '删除时间',
    key: 'createdAt',
    sorter: true,
    resizable: true,
    width: 150,
  },
  {
    title: '操作',
    key: 'operation',
    resizable: true,
    width: 100,
  },
]);

/*
 * 列表
 */
const dataList = ref<IRecycle[]>([]);
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
  if (filters.value.content) {
    [params.content] = filters.value.content;
  }
  if (filters.value.deleteStaffName) {
    [params.deleteStaffName] = filters.value.deleteStaffName;
  }
  if (filters.value.type?.length > 0) {
    params.type = filters.value.type;
  }
  if (sorter.value.columnKey) {
    params.sortField = sorter.value.columnKey;
    params.sortOrder = sorter.value.order === 'ascend' ? 'asc' : 'desc';
  }

  const [err, res] = await recycleApi.getList(params);
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
const onDelete = async (record: IRecycle) => {
  const confirm = await confirmModal({
    title: '删除',
    content: '确定要永久删除该记录吗？',
  });

  if (!confirm) {
    return;
  }

  const [err] = await recycleApi.deleteRecycle({ recycleId: record.recycleId });
  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '删除失败' }));
    return;
  }

  message.success('删除成功');
  getList();
};
</script>

<style scoped></style>
