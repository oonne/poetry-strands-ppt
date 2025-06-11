<template>
  <div class="app-view-header">
    <a-space>
      <a-button
        type="primary"
        @click="routerJump($event, { name: 'edit-staff' })"
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
        <template v-if="column.key === 'name'">
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
      <template v-if="column.key === 'name' && filters.name">
        账号名({{ filters.name[0] }})
      </template>
      <template v-if="column.key === 'isActive' && filters.isActive">
        是否启用({{ filters.isActive[0] === true ? '启用' : '禁用' }})
      </template>
      <template v-if="column.key === 'role' && filters.role">
        角色({{ getRoleName(filters.role[0]) }})
      </template>
    </template>

    <template #bodyCell="{ column, record, index }">
      <!-- 序号 -->
      <template v-if="column.key === 'index'">
        {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
      </template>

      <!-- 账号名 -->
      <template v-if="column.key === 'name'">
        {{ record.name || '-' }}
      </template>

      <!-- 是否启用 -->
      <template v-if="column.key === 'isActive'">
        <a-switch
          v-model:checked="record.isActive"
          size="small"
          @change="onChangeActive(record)"
        />
      </template>

      <!-- 角色 -->
      <template v-if="column.key === 'role'">
        {{ getRoleName(record.role) }}
      </template>

      <!-- RefreshToken -->
      <template v-if="column.key === 'refreshToken'">
        <a-flex
          align="center"
          gap="small"
        >
          <span>
            {{ record.refreshToken || '-' }}
          </span>
          <Icon
            v-if="record.refreshToken"
            icon="copy"
            class="copy-icon"
            @click="copyText(record.refreshToken)"
          />
        </a-flex>
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
            name: 'edit-staff',
            query: { staffId: record.staffId },
          })"
        >
          编辑
        </a-button>
        <a-button
          size="small"
          type="link"
          :disabled="record.staffId === staffInfo.staffId"
          @click="onResetToken(record)"
        >
          重置登录态
        </a-button>
        <a-button
          size="small"
          type="link"
          danger
          :disabled="record.staffId === staffInfo.staffId"
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
import { storeToRefs } from 'pinia';
import { message, TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import useTable from '@/hooks/use-table';
import { useStaffStore } from '@/store/index';
import { staffApi } from '@/api/index';
import { buildErrorMsg, Feedback } from '@/utils/index';
import Icon from '@/components/icon-svg/index.vue';
import useLink from '@/hooks/use-link';
import type { IStaff } from '@/types/staff';
import { getRoleName, getRoleFilters } from './staff-utils';

const { routerJump } = useLink();
const { confirmModal, copyText } = Feedback;
const staffStore = useStaffStore();
const { staffInfo } = storeToRefs(staffStore);

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
    title: '账号名',
    key: 'name',
    sorter: true,
    customFilterDropdown: true,
    resizable: true,
    width: 150,
  },
  {
    title: '是否启用',
    key: 'isActive',
    sorter: true,
    filters: [
      {
        text: '启用',
        value: true,
      },
      {
        text: '禁用',
        value: false,
      },
    ],
    filterMultiple: false,
    resizable: true,
    width: 150,
  },
  {
    title: '角色',
    key: 'role',
    sorter: true,
    filters: getRoleFilters(),
    resizable: true,
    width: 150,
  },
  {
    title: 'RefreshToken',
    key: 'refreshToken',
    resizable: true,
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
const dataList = ref<IStaff[]>([]);
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
  if (filters.value.name) {
    [params.name] = filters.value.name;
  }
  if (filters.value.isActive?.length === 1) {
    [params.isActive] = filters.value.isActive;
  }
  if (filters.value.role?.length > 0) {
    params.role = filters.value.role;
  }
  if (sorter.value.columnKey) {
    params.sortField = sorter.value.columnKey;
    params.sortOrder = sorter.value.order === 'ascend' ? 'asc' : 'desc';
  }

  const [err, res] = await staffApi.getList(params);
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
 * 启用/禁用
 */
const onChangeActive = async (record: IStaff) => {
  if (record.staffId === staffInfo.value.staffId) {
    message.error('不能操作当前账号');
    dataList.value = dataList.value.map((item) => {
      if (item.staffId === record.staffId) {
        return {
          ...item,
          isActive: !record.isActive,
        };
      }
      return item;
    });
    return;
  }

  const [err] = await staffApi.updateStaff({
    staffId: record.staffId,
    isActive: record.isActive,
  });

  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '操作失败' }));
    dataList.value = dataList.value.map((item) => {
      if (item.staffId === record.staffId) {
        return {
          ...item,
          isActive: !record.isActive,
        };
      }
      return item;
    });
  }
};

/*
 * 重置登录态
 */
const onResetToken = async (record: IStaff) => {
  const confirm = await confirmModal({
    title: '重置登录态',
    content: `确定重置 ${record.name} 的登录态吗？`,
  });

  if (!confirm) {
    return;
  }

  const [err] = await staffApi.updateRefreshToken({ staffId: record.staffId });
  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '重置登录态失败' }));
    return;
  }

  message.success('Token已更新');
  getList();
};

/*
 * 删除
 */
const onDelete = async (record: IStaff) => {
  const confirm = await confirmModal({
    title: '删除',
    content: `确定删除 ${record.name} 吗？`,
  });

  if (!confirm) {
    return;
  }

  const [err] = await staffApi.deleteStaff({ staffId: record.staffId });
  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '删除失败' }));
    return;
  }

  message.success('删除成功');
  getList();
};
</script>

<style scoped>
</style>
