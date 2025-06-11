import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteLocationNormalized } from 'vue-router';
import pages from './pages';

// 默认跳转到首页
pages.push({
  path: '/',
  redirect: '/home/index',
});

// 找不到则跳转到404
pages.push({
  path: '/:pathMatch(.*)*',
  redirect: '/404',
});

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes: pages,
});

// 路由全局前置守卫
router.beforeEach(async (toRoute: RouteLocationNormalized) => {
  const token = localStorage.getItem('TOKEN');
  const { meta = {} } = toRoute;
  const { noNeedLogin } = meta;

  // 正常访问
  if (noNeedLogin || token) {
    return true;
  }

  // 重定向到登录页面
  return {
    name: 'login',
    replace: true,
  };
});

// 如果路由加载失败，则重新加载
router.onError((error) => {
  console.error('路由加载失败', error);
  window.location.reload();
});

export default router;
