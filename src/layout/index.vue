<template>
  <a-layout class="page-layout">
    <!-- 侧导航 -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      theme="light"
      :trigger="null"
      collapsible
    >
      <SideView v-model:collapsed="collapsed" />
    </a-layout-sider>

    <a-layout>
      <!-- 顶栏 -->
      <a-layout-header class="header">
        <HeaderView />
      </a-layout-header>

      <!-- 内容 -->
      <a-layout-content>
        <AppView />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref, watch, onBeforeMount } from 'vue';
import { useStaffStore } from '@/store/index';
import useInterval from '@/hooks/use-interval';
import AppView from './app-view.vue';
import HeaderView from './header-view.vue';
import SideView from './side-view.vue';

/*
 * 是否折叠侧导航
 */
const defaultCollapsed = localStorage.getItem('SIDE_COLLAPSED') === 'true';
const collapsed = ref<boolean>(defaultCollapsed);
watch(collapsed, (value) => {
  localStorage.setItem('SIDE_COLLAPSED', value.toString());
});

/*
 * 初始化
 */
const init = () => {
  const staffStore = useStaffStore();
  staffStore.getStaffInfo();
  staffStore.refreshToken();
};

/* 进入页面时初始化 */
onBeforeMount(() => {
  init();
});

/* 定期刷新token */
useInterval(() => {
  const staffStore = useStaffStore();
  staffStore.refreshToken();
}, 60 * 60 * 1000);
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
}

.header {
  background-color: #fff;
  padding: 0 calc(var(--app-view-padding) + var(--app-view-margin));
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
