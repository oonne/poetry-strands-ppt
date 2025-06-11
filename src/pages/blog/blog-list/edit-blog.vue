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
        name="title"
        :rules="[{ required: true }]"
      >
        <a-input
          v-model:value="formData.title"
          placeholder="请输入标题"
        />
      </a-form-item>

      <a-form-item
        label="发布日期"
        name="publishDate"
        :rules="[{ required: true }]"
      >
        <a-date-picker
          v-model:value="formData.publishDate"
          placeholder="请选择发布日期"
          :style="{ width: '100%' }"
        />
      </a-form-item>

      <a-form-item label="是否启用">
        <a-switch v-model:checked="formData.isActive" />
      </a-form-item>

      <a-form-item
        label="链接"
        name="linkUrl"
        :rules="[{ required: true }]"
      >
        <a-input
          v-model:value="formData.linkUrl"
          placeholder="请输入链接"
        />
      </a-form-item>

      <a-form-item label="Description">
        <a-input
          v-model:value="formData.description"
          placeholder="请输入Description"
        />
      </a-form-item>

      <a-form-item label="Keywords">
        <a-input
          v-model:value="formData.keywords"
          placeholder="请输入Keywords"
        />
      </a-form-item>

      <a-form-item label="内容">
        <div class="content-wrapper">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
            :default-config="toolbarConfig"
            mode="simple"
          />
          <Editor
            v-model="formData.content"
            style="height: 300px; overflow-y: hidden;"
            :default-config="editorConfig"
            @on-created="handleCreated"
          />
        </div>
      </a-form-item>

      <a-button
        type="primary"
        :loading="loading"
        @click="onSubmit(false)"
      >
        保存
      </a-button>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import {
  ref, shallowRef, onMounted, onBeforeUnmount,
} from 'vue';
import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { emit as busEmit } from 'eventbus-typescript';
import { i18nChangeLanguage, IToolbarConfig, IEditorConfig } from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { useLocaleStore } from '@/store/index';
import { blogApi } from '@/api/index';
import { to, buildErrorMsg } from '@/utils/index';
import type { IBlog } from '@/types/blog';

const route = useRoute();
const router = useRouter();
const localeStore = useLocaleStore();

/*
 * 富文本编辑器
 */
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 编辑器配置
const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    'redo', // 重做
    'undo', // 撤销
    'clearStyle', // 清除样式
    '|',
    'headerSelect', // 标题
    'fontSize', // 字体大小
    'fontFamily', // 字体
    'lineHeight', // 行高
    '|',
    'color', // 文字颜色
    'bgColor', // 背景色
    'bold', // 加粗
    'italic', // 斜体
    'underline', // 下划线
    'through', // 删除线
    'sub', // 下标
    'sup', // 上标
    '|',
    'justifyLeft', // 左对齐
    'justifyRight', // 右对齐
    'justifyCenter', // 居中
    'justifyJustify', // 两端对齐
    '|',
    'blockquote', // 引用
    'divider', // 分割线
    'emotion', // 表情
    'insertImage', // 插入图片
    'insertLink', // 插入链接
    'bulletedList', // 无序列表
    'numberedList', // 有序列表
    // 'todo', // 待办事项
    '|',
    'insertTable', // 插入表格
    'insertTableRow', // 插入行
    'deleteTableRow', // 删除行
    'insertTableCol', // 插入列
    'deleteTableCol', // 删除列
    'tableHeader', // 表头
    'tableFullWidth', // 表格铺满
  ],
};
const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入内容',
};

// 编辑器创建成功
const handleCreated = (editor: any) => {
  editorRef.value = editor;
  // 多语言处理
  if (localeStore.locale === 'en_US') {
    i18nChangeLanguage('en');
  } else {
    i18nChangeLanguage('zh-CN');
  }
};

/*
 * 表单
 */
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

/*
 * 查询详情
 */
const getDetail = async () => {
  if (!route.query.blogId) {
    busEmit('UPDATE_PAGE_TITLE', '新增博客');
    return;
  }

  const [err, res] = await blogApi.getDetail({ blogId: route.query.blogId });
  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '查询失败' }));
    return;
  }
  formData.value = {
    ...res.data,
    publishDate: dayjs(res.data.publishDate),
  };
  busEmit('UPDATE_PAGE_TITLE', `编辑博客 - ${formData.value.title}`);
};

/*
 * 提交
 */
const loading = ref(false);
const onSubmit = async (back = false) => {
  if (loading.value) {
    return;
  }

  const [validateErr] = await to(formRef.value?.validate());
  if (validateErr) {
    return;
  }

  loading.value = true;
  const [err] = await (
    formData.value.blogId
      ? blogApi.updateBlog(formData.value)
      : blogApi.addBlog(formData.value)
  );
  loading.value = false;

  if (err) {
    message.error(buildErrorMsg({ err, defaultMsg: '提交失败' }));
    return;
  }

  message.success('提交成功');
  if (!back) {
    router.back();
  }
};

/*
 * 处理键盘事件
 */
const handleKeyDown = (e: KeyboardEvent) => {
  // 检测Ctrl+S组合键 (Mac上是Command+S)
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    // 只在编辑的时候生效，创建的时候不生效
    if (loading.value || !formData.value.blogId) {
      return;
    }
    // 只在编辑器内容不为空的时候生效
    if (!formData.value.content) {
      return;
    }

    e.preventDefault(); // 阻止浏览器默认的保存行为
    onSubmit(true);
  }
};

/*
 * 进入页面
 */
onMounted(async () => {
  getDetail();

  // 添加键盘事件监听器
  window.addEventListener('keydown', handleKeyDown);
});

/*
 * 组件销毁
 */
onBeforeUnmount(() => {
  // 销毁编辑器
  const editor = editorRef.value;
  if (editor) {
    editor.destroy();
  }

  // 移除键盘事件监听器
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.app-form {
  max-width: 800px;
}

.content-wrapper{
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  overflow: hidden;
}
</style>
