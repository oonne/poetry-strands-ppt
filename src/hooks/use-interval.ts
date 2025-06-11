import { onMounted, onUnmounted } from 'vue';
import type { Interval } from '@/types/index';

/*
 * 定时执行回调函数
 */
// eslint-disable-next-line no-unused-vars
type Callback = (...args: any[])=>void;

const useEventOn = (callback: Callback, interval: number) => {
  let timerId: Interval;

  onMounted(() => {
    timerId = setInterval(callback, interval);
  });

  onUnmounted(() => {
    if (!timerId) {
      return;
    }
    clearInterval(timerId);
  });
};

export default useEventOn;
