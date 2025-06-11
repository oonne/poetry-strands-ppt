import type { RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';

const pages: RouteRecordRaw[] = [
  /*
   * 系统页面
   */
  // 异常
  {
    path: '/403',
    name: '403',
    component: () => import('@/pages/exception/index.vue'),
    meta: {
      noNeedLogin: true,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/pages/exception/index.vue'),
    meta: {
      noNeedLogin: true,
    },
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/pages/exception/index.vue'),
    meta: {
      noNeedLogin: true,
    },
  },

  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/login-form.vue'),
    meta: {
      noNeedLogin: true,
    },
  },

  /*
   * 首页
   */
  {
    path: '/home',
    component: Layout,
    children: [
      // 首页
      {
        path: 'index',
        component: () => import('@/pages/home/index.vue'),
        name: 'home',
        meta: {
          sideKey: 'home',
          title: '首页',
        },
      },
    ],
  },

  /*
   * 系统
   */
  {
    path: '/system',
    component: Layout,
    children: [
      // 成员管理
      {
        path: 'staff',
        component: () => import('@/pages/system/staff/index.vue'),
        name: 'staff',
        meta: {
          sideKey: 'staff',
          title: '账号管理',
        },
      },
      // 新增/编辑成员
      {
        path: 'edit-staff',
        component: () => import('@/pages/system/staff/edit-staff.vue'),
        name: 'edit-staff',
        meta: {
          sideKey: 'staff',
          title: '新增/编辑成员',
        },
      },
      // 回收站
      {
        path: 'recycle',
        component: () => import('@/pages/system/recycle/index.vue'),
        name: 'recycle',
        meta: {
          sideKey: 'recycle',
          title: '回收站',
        },
      },
      // 回收详情
      {
        path: 'recycle-detail',
        component: () => import('@/pages/system/recycle/recycle-detail.vue'),
        name: 'recycle-detail',
        meta: {
          sideKey: 'recycle',
          title: '回收详情',
        },
      },
      // 系统配置
      {
        path: 'setting',
        component: () => import('@/pages/system/setting/index.vue'),
        name: 'setting',
        meta: {
          sideKey: 'setting',
          title: '系统配置',
        },
      },
      // 新增/编辑系统配置
      {
        path: 'edit-setting',
        component: () => import('@/pages/system/setting/edit-setting.vue'),
        name: 'edit-setting',
        meta: {
          sideKey: 'setting',
          title: '新增/编辑系统配置',
        },
      },
      // 系统配置详情
      {
        path: 'setting-detail',
        component: () => import('@/pages/system/setting/setting-detail.vue'),
        name: 'setting-detail',
        meta: {
          sideKey: 'setting',
          title: '系统配置详情',
        },
      },
    ],
  },

  /*
   * 博客
   */
  {
    path: '/blog',
    component: Layout,
    children: [
      // 博客列表
      {
        path: 'blog-list',
        component: () => import('@/pages/blog/blog-list/index.vue'),
        name: 'blog-list',
        meta: {
          sideKey: 'blog-list',
          title: '博客列表',
        },
      },
      // 新增/编辑博客
      {
        path: 'edit-blog',
        component: () => import('@/pages/blog/blog-list/edit-blog.vue'),
        name: 'edit-blog',
        meta: {
          sideKey: 'blog-list',
          title: '新增/编辑博客',
        },
      },
      // 编辑HTML
      {
        path: 'edit-html',
        component: () => import('@/pages/blog/blog-list/edit-html.vue'),
        name: 'edit-html',
        meta: {
          sideKey: 'blog-list',
          title: '编辑HTML',
        },
      },
      // 博客详情
      {
        path: 'blog-detail',
        component: () => import('@/pages/blog/blog-list/blog-detail.vue'),
        name: 'blog-detail',
        meta: {
          sideKey: 'blog-list',
          title: '博客详情',
        },
      },
      // 图片管理
      {
        path: 'img-list',
        component: () => import('@/pages/blog/img-list/index.vue'),
        name: 'img-list',
        meta: {
          sideKey: 'img-list',
          title: '图片管理',
        },
      },
      // 关于我
      {
        path: 'about-me',
        component: () => import('@/pages/blog/about-me/index.vue'),
        name: 'about-me',
        meta: {
          sideKey: 'about-me',
          title: '关于我',
        },
      },
    ],
  },
];

export default pages;
