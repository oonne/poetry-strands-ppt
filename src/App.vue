<template>
  <a-config-provider
    :locale="antLocale"
    :theme="{
      token: themeToken,
    }"
  >
    <div
      id="app-wrapper"
      :class="`lang_${locale}`"
    >
      <router-view />
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useLocaleStore, useStaffStore } from '@/store/index';
import { themeToken } from '@/config/theme-token';

const localeStore = useLocaleStore();
const { locale, antLocale } = storeToRefs(localeStore);

/*
 * 初始化
 */
const init = () => {
  // UUID
  const staffStore = useStaffStore();
  staffStore.initUUID();

  // 语言
  localeStore.initLocale();
};

onBeforeMount(() => {
  init();
});
</script>

<style>
@import './assets/css/reset.css';
@import './assets/css/ant.css';
@import './assets/css/common.css';

/* 富文本编辑器 */
@import '@wangeditor/editor/dist/css/style.css';
</style>
