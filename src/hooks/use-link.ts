import { useRouter, RouteLocationRaw } from 'vue-router';

/*
 * 链接跳转
 */
const useLink = () => {
  const router = useRouter();

  /*
   * 跳转
   */
  const routerJump = (event: MouseEvent, to: RouteLocationRaw) => {
    // 如果按住 Ctrl 或 Command 键，在新标签页打开
    if (event.ctrlKey || event.metaKey) {
      let path: string = window.location.origin;
      if (typeof to === 'string') {
        path = to;
      } else {
        const resolved = router.resolve(to);
        path = resolved.href;
      }
      window.open(path, '_blank');
      return;
    }

    // 正常跳转
    router.push(to);
  };

  return { routerJump };
};

export default useLink;
