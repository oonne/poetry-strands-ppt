<template>
  <router-view>
    <template #default="{ Component, route }">
      <KeepAlive>
        <div class="page-wrapper">
          <component
            :is="Component"
            :key="`${route.path}&${locale}}`"
          />
        </div>
      </KeepAlive>
    </template>
  </router-view>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useLocaleStore } from '@/store/index';

const localeStore = useLocaleStore();
const { locale } = storeToRefs(localeStore);
</script>

<style scoped>
.page-wrapper{
  background-color: #fff;
  margin: var(--app-view-margin);
  padding: var(--app-view-padding);
  border-radius: 4px;
  max-height: calc(100vh - var(--header-height) - (var(--app-view-margin) * 2));
  overflow: auto;
}
</style>
