import {
  onMounted, onUnmounted, onActivated, onDeactivated,
} from 'vue';
import { on, off } from 'eventbus-typescript';

/*
 * 事件总线通信
 */
// eslint-disable-next-line no-unused-vars
type Callback = (...args: any[])=>void;

const useEventOn = (
  name: string,
  id: string,
  callback: Callback,
  isKeepAlive?: boolean,
) => {
  const onEnter = isKeepAlive ? onActivated : onMounted;
  const onLeave = isKeepAlive ? onDeactivated : onUnmounted;

  // 在组件挂载时，监听事件
  onEnter(() => {
    on(name, id, callback);
  });

  // 在组件卸载时，取消监听事件
  onLeave(() => {
    off(name, id);
  });
};

export default useEventOn;
