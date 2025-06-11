<template>
  <component
    :is="svgIcon"
    v-if="svgIcon"
  />
</template>

<script setup>
import { shallowRef, watchEffect } from 'vue';

const props = defineProps({
  // 图标名称（不需要带.svg后缀）
  icon: {
    type: String,
    required: true,
  },
});

const svgIcon = shallowRef(null);

watchEffect(async () => {
  try {
    const module = await import(`@/assets/icon/${props.icon}.svg`);
    svgIcon.value = module.default;
  } catch (error) {
    console.warn(`Icon not found: ${props.icon}.svg`);
    svgIcon.value = null;
  }
});
</script>

<style scoped>
</style>
