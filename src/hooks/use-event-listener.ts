import { onMounted, onUnmounted } from 'vue';

/*
 * 监听事件
 */
// eslint-disable-next-line no-unused-vars
type Callback = (...args: any[])=>void;

const useEventListener = (
  node: HTMLElement | Window | Document,
  name: string,
  callback: Callback,
) => {
  // 在组件挂载时，监听事件
  onMounted(() => {
    node.addEventListener(name, callback, false);
  });

  // 在组件卸载时，取消监听事件
  onUnmounted(() => {
    node.removeEventListener(name, callback, false);
  });
};

export default useEventListener;
