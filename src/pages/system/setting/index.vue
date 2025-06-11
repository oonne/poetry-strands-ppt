<template>
  <div class="app-view-header">
    <a-space>
      <a-button
        type="primary"
        @click="routerJump($event, { name: 'edit-setting' })"
      >
        新增
      </a-button>
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
        <template v-if="column.key === 'key' || column.key === 'value' || column.key === 'remark'">
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
      <template v-if="column.key === 'key' && filters.key">
        KEY({{ filters.key[0] }})
      </template>
      <template v-if="column.key === 'value' && filters.value">
        VALUE({{ filters.value[0] }})
      </template>
      <template v-if="column.key === 'remark' && filters.remark">
        备注({{ filters.remark[0] }})
      </template>
    </template>

    <template #bodyCell="{ column, record, index }">
      <!-- 序号 -->
      <template v-if="column.key === 'index'">
        {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
      </template>

      <!-- 配置名称 -->
      <template v-if="column.key === 'key'">
        {{ record.key || '-' }}
      </template>

      <!-- 配置值 -->
      <template v-if="column.key === 'value'">
        {{ record.value || '-' }}
      </template>

      <!-- 备注 -->
      <template v-if="column.key === 'remark'">
        {{ record.remark || '-' }}
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
          @click="routerJump($event, {
            name: 'setting-detail',
            query: { settingId: record.settingId },
          })"
        >
          详情
        </a-button>
        <a-button
          size="small"
          type="link"
          @click="routerJump($event, {
            name: 'edit-setting',
            query: { settingId: record.settingId },
          })"
        >
          编辑
        </a-button>
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
import { settingApi } from '@/api/index';
import { buildErrorMsg, Feedback } from '@/utils/index';
import useLink from '@/hooks/use-link';
import type { ISetting } from '@/types/setting';

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
    title: 'KEY',
    key: 'key',
    sorter: true,
    customFilterDropdown: true,
    resizable: true,
    width: 150,
  },
  {
    title: 'VALUE',
    key: 'value',
    sorter: true,
    customFilterDropdown: true,
    resizable: true,
    width: 200,
  },
  {
    title: '备注',
    key: 'remark',
    resizable: true,
    customFilterDropdown: true,
    width: 200,
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
const dataList = ref<ISetting[]>([]);
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
  if (filters.value.key) {
    [params.key] = filters.value.key;
  }
  if (filters.value.value) {
    [params.value] = filters.value.value;
  }
  if (filters.value.remark) {
    [params.remark] = filters.value.remark;
  }
  if (sorter.value.columnKey) {
    params.sortField = sorter.value.columnKey;
    params.sortOrder = sorter.value.order === 'ascend' ? 'asc' : 'desc';
  }

  const [err, res] = await settingApi.getList(params);
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
const onDelete = async (record: ISetting) => {
  const confirm = await confirmModal({
    title: '删除',
    content: `确定删除 ${record.name} 吗？`,
  });

  if (!confirm) {
    return;
  }

  const [err] = await settingApi.deleteSetting({ settingId: record.settingId });
  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '删除失败' }));
    return;
  }

  message.success('删除成功');
  getList();
};
</script>

<style scoped></style>
