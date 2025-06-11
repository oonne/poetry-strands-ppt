import { ref } from 'vue';
import { defineStore } from 'pinia';
import config from '@/config/index';

/*
 * 基础数据
 */
export default defineStore('basic', () => {
  /*
   * 分页大小
   */
  const pageSize = ref(config.pageSize);

  // 设置分页大小
  const setPageSize = (size: number) => {
    pageSize.value = size;
  };

  return {
    pageSize,
    setPageSize,
  };
});
