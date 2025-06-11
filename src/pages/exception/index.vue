<template>
  <a-result
    :status="code"
    :title="code"
    :sub-title="subTitle"
  >
    <template #extra>
      <a-button
        type="primary"
        @click="back"
      >
        {{ $t('btn_back') }}
      </a-button>
    </template>
  </a-result>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import i18n from '@/locales/i18n';

const { t } = i18n.global;

/*
 * 错误码和提示语
 */
type ExcrptionCode = '403' | '404' | '500'
const route = useRoute();
const code = ref(route.name as ExcrptionCode);
const subTitle = computed(() => {
  if (code.value === '403') {
    return t('exception_403');
  }
  if (code.value === '404') {
    return t('exception_404');
  }
  if (code.value === '500') {
    return t('exception_500');
  }
  return '';
});

/*
 * 返回登录页
 */
const router = useRouter();
const back = () => {
  router.replace({ name: 'login' });
};

</script>

<style scoped>
</style>
