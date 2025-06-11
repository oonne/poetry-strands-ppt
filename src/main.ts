import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import store from '@/store/store';
import i18n from '@/locales/i18n';
import router from '@/router';
import App from '@/App.vue';
import 'ant-design-vue/dist/reset.css';

/* 初始化 */
const bootstrap = async () => {
  const app = createApp(App);

  // Antd
  app.use(Antd);

  // Pinia
  app.use(store);

  // i18n
  app.use(i18n);

  // 路由
  app.use(router);
  await router.isReady();

  // 挂载应用
  app.mount('#app');
};

bootstrap();
