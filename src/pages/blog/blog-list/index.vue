<template>
  <div class="app-view-header">
    <a-space>
      <a-button
        type="primary"
        @click="router.push({ name: 'edit-blog' })"
      >
        新增
      </a-button>
      <a-button
        @click="onGenerate"
      >
        静态化
      </a-button>
    </a-space>

    <div class="app-view-header-sum">
      总计: {{ pagination.total }}
    </div>
  </div>

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
        <template
          v-if="column.key === 'title'
            || column.key === 'description'
            || column.key === 'content'
            || column.key === 'linkUrl'"
        >
          <a-input-search
            :value="selectedKeys[0]"
            size="small"
            allow-clear
            @change="(e: any) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @search="confirm"
          />
        </template>
        <!-- 发布日期 -->
        <template v-if="column.key === 'publishDate'">
          <a-range-picker
            :value="selectedKeys[0]"
            size="small"
            allow-clear
            :presets="rangePresets"
            @change="(e: any) => {
              setSelectedKeys(e ? [e] : []);
              confirm();
            }"
          />
        </template>
      </div>
    </template>

    <!-- 显示当前的搜索条件 -->
    <template #headerCell="{ column }">
      <template v-if="column.key === 'title' && filters.title">
        标题({{ filters.title[0] }})
      </template>
      <template v-if="column.key === 'publishDate' && filters.publishDate">
        发布日期({{ filters.publishDate[0].map(
          (item: any) => dayjs(item).format('YYYY-MM-DD'),
        ).join(' ~ ') }})
      </template>
      <template v-if="column.key === 'description' && filters.description">
        Description({{ filters.description[0] }})
      </template>
      <template v-if="column.key === 'content' && filters.content">
        内容({{ filters.content[0] }})
      </template>
      <template v-if="column.key === 'linkUrl' && filters.linkUrl">
        链接({{ filters.linkUrl[0] }})
      </template>
    </template>

    <template #bodyCell="{ column, record, index }">
      <!-- 序号 -->
      <template v-if="column.key === 'index'">
        {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
      </template>

      <!-- 标题 -->
      <template v-if="column.key === 'title'">
        {{ record.title }}
      </template>

      <!-- 发布日期 -->
      <template v-if="column.key === 'publishDate'">
        {{ dayjs(record.publishDate).format('YYYY-MM-DD') }}
      </template>

      <!-- Description -->
      <template v-if="column.key === 'description'">
        {{ record.description }}
      </template>

      <!-- 内容 -->
      <template v-if="column.key === 'content'">
        {{ removeHtmlTags(record.content) }}
      </template>

      <!-- 链接 -->
      <template v-if="column.key === 'linkUrl'">
        <a-flex
          align="center"
          gap="small"
        >
          <a
            :href="`${VITE_BLOG_URL}/${record.linkUrl}`"
            target="_blank"
          >
            {{ record.linkUrl }}
          </a>
          <Icon
            icon="copy"
            class="copy-icon"
            @click="copyText(`${VITE_BLOG_URL}/${record.linkUrl}`)"
          />
        </a-flex>
      </template>

      <!-- 是否启用 -->
      <template v-if="column.key === 'isActive'">
        <a-switch
          v-model:checked="record.isActive"
          size="small"
          @change="onChangeActive(record)"
        />
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
          @click="router.push({ name: 'blog-detail', query: { blogId: record.blogId } })"
        >
          详情
        </a-button>
        <a-button
          size="small"
          type="link"
          @click="router.push({ name: 'edit-blog', query: { blogId: record.blogId } })"
        >
          编辑
        </a-button>
        <a-button
          size="small"
          type="link"
          @click="router.push({ name: 'edit-html', query: { blogId: record.blogId } })"
        >
          编辑HTML
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
import { useRouter } from 'vue-router';
import { message, TableColumnsType } from 'ant-design-vue';
import dayjs from 'dayjs';
import useTable from '@/hooks/use-table';
import { blogApi } from '@/api/index';
import {
  buildErrorMsg, Feedback, Common,
} from '@/utils/index';
import Icon from '@/components/icon-svg/index.vue';
import type { IBlog } from '@/types/blog';

const { VITE_BLOG_URL } = import.meta.env;
const router = useRouter();
const { confirmModal, copyText } = Feedback;
const { removeHtmlTags } = Common;

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
    title: '标题',
    key: 'title',
    customFilterDropdown: true,
    resizable: true,
    width: 200,
  },
  {
    title: '发布日期',
    key: 'publishDate',
    sorter: true,
    customFilterDropdown: true,
    resizable: true,
    width: 150,
  },
  {
    title: 'Description',
    key: 'description',
    customFilterDropdown: true,
    resizable: true,
    width: 200,
  },
  {
    title: '内容',
    key: 'content',
    customFilterDropdown: true,
    resizable: true,
    width: 150,
  },
  {
    title: '链接',
    key: 'linkUrl',
    resizable: true,
    customFilterDropdown: true,
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
    width: 100,
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
const dataList = ref<IBlog[]>([]);
const {
  loading,
  setGetDataFunction,
  pagination,
  filters,
  sorter,
  changeTable,
  onResizeColumn,
  rowClassName,
  rangePresets,
  getDateFilter,
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
  if (filters.value.title) {
    [params.title] = filters.value.title;
  }
  if (filters.value.publishDate) {
    params.publishDate = getDateFilter(filters.value.publishDate[0]);
  }
  if (filters.value.description) {
    [params.description] = filters.value.description;
  }
  if (filters.value.content) {
    [params.content] = filters.value.content;
  }
  if (filters.value.linkUrl) {
    [params.linkUrl] = filters.value.linkUrl;
  }
  if (filters.value.isActive) {
    [params.isActive] = filters.value.isActive;
  }
  if (sorter.value.columnKey) {
    params.sortField = sorter.value.columnKey;
    params.sortOrder = sorter.value.order === 'ascend' ? 'asc' : 'desc';
  }

  const [err, res] = await blogApi.getList(params);
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
const onChangeActive = async (record: IBlog) => {
  const [err] = await blogApi.updateBlog({
    blogId: record.blogId,
    isActive: record.isActive,
  });

  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '操作失败' }));
    dataList.value = dataList.value.map((item) => {
      if (item.blogId === record.blogId) {
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
 * 删除
 */
const onDelete = async (record: IBlog) => {
  const confirm = await confirmModal({
    title: '删除',
    content: `确定删除 ${record.title} 吗？`,
  });

  if (!confirm) {
    return;
  }

  const [err] = await blogApi.deleteBlog({ blogId: record.blogId });
  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '删除失败' }));
    return;
  }

  message.success('删除成功');
  getList();
};

/*
 * 静态化
 */
const onGenerate = async () => {
  const [err] = await blogApi.generateBlog();
  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '静态化失败' }));
    return;
  }

  message.success('开始生成HTML');
};
</script>

<style scoped>
</style>
