<template>
  <div
    class="loading-spinner"
    :style="spinnerStyle"
  />
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 36,
    },
  },
  computed: {
    spinnerStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`,
      };
    },
  },
};
</script>

<style scoped>
.loading-spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #bbb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
