<template>
  <div class="container" />
</template>

<script setup lang="ts">
</script>

<style scoped>
.container {
  width: 100%;
  height: calc(100vh
  - var(--header-height)
  - var(--app-view-margin) * 2
  - var(--app-view-padding) * 2);
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
