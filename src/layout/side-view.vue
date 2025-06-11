<template>
  <div
    class="header"
    @click="$emit('update:collapsed', !collapsed)"
  >
    <!-- Ring -->
    <div
      class="sidebar-logo"
      :style="logoStyle"
    >
      <img
        :src="AuraImg"
        class="logo-rotation"
        :class="`${collapsed ? 'logo-collapsed' : 'logo'}`"
        :style="rotationStyle"
      >
    </div>
  </div>

  <!-- 菜单 -->
  <a-menu
    v-model:selected-keys="selectedKeys"
    v-model:open-keys="openKeys"
    mode="inline"
    class="side-menu"
    @click="onSelectMenu"
  >
    <template
      v-for="sideMenu of sideMenuList"
      :key="sideMenu.key"
    >
      <!-- 二级导航 -->
      <template v-if="sideMenu.children">
        <a-sub-menu
          :key="sideMenu.key"
          :title="sideMenu.title"
        >
          <template #icon>
            <Icon
              v-if="sideMenu.icon"
              :icon="sideMenu.icon"
              class="side-menu-icon"
            />
          </template>

          <a-menu-item
            v-for="subMenu of sideMenu.children"
            :key="subMenu.key"
            :title="subMenu.title"
          >
            <span>{{ subMenu.title }}</span>
          </a-menu-item>
        </a-sub-menu>
      </template>

      <!-- 一级导航 -->
      <a-menu-item
        v-else
        :key="sideMenu.key"
        :title="sideMenu.title"
      >
        <template #icon>
          <Icon
            v-if="sideMenu.icon"
            :icon="sideMenu.icon"
            class="side-menu-icon"
          />
        </template>
        <span>{{ sideMenu.title }}</span>
      </a-menu-item>
    </template>
  </a-menu>
</template>

<script lang="ts" setup>
import {
  ref, watch, computed, onMounted,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStaffStore } from '@/store/index';
import SideMenuConfig, { ISideConfig } from '@/config/side-menu';
import Icon from '@/components/icon-svg/index.vue';
import AuraImg from '@/assets/img/aura.png';

const route = useRoute();
const router = useRouter();
const staffStore = useStaffStore();

const props = defineProps<{
  collapsed: boolean
}>();
defineEmits(['update:collapsed']);

/*
 * 筛选出显示的菜单
 */
const sideMenuList = computed(() => {
  const userRole = staffStore.staffInfo.role || 0;

  const filterMenuByRole = (menuList: ISideConfig[]): ISideConfig[] => {
    const result: ISideConfig[] = [];

    menuList.forEach((menu) => {
      const hasPermission = !menu.roles || menu.roles.includes(userRole);

      if (!hasPermission) {
        return;
      }

      if (!menu.children) {
        result.push(menu);
        return;
      }

      const filteredChildren = filterMenuByRole(menu.children);
      if (filteredChildren.length) {
        result.push({
          ...menu,
          children: filteredChildren,
        });
      }
    });

    return result;
  };

  return filterMenuByRole(SideMenuConfig);
});

/*
 * 高亮
 */
const sideKey = (route.meta?.sideKey || '') as string;
const selectedKeys = ref<string[]>([sideKey]);
router.afterEach((to) => {
  selectedKeys.value = [to.meta?.sideKey || ''] as string[];
});

/*
 * 展开菜单
 * 仅在展开侧边栏时展开菜单。折叠时不展示菜单
 */
const openKeys = ref<string[]>([]);
const getOpenKey = () => {
  const openKey = sideMenuList.value.find((sideMenu) => {
    if (props.collapsed) {
      return false;
    }
    if (!sideMenu?.children) {
      return false;
    }
    return sideMenu.children.find((subMenu) => subMenu.key === sideKey);
  });

  openKeys.value = openKey?.key ? [openKey.key] : [];
};
watch(() => props.collapsed, () => {
  getOpenKey();
});
getOpenKey();

/*
 * 菜单跳转
 */
const onSelectMenu = (selectedItem: any) => {
  const key = selectedItem.key as string;
  const domEvent = selectedItem.domEvent as MouseEvent;

  // 如果按住ctrl再点击则新窗口打开
  if (domEvent.ctrlKey || domEvent.metaKey) {
    const resolved = router.resolve({ name: key });
    window.open(resolved.href, '_blank');
    return;
  }

  // 正常跳转
  router.push({ name: key });
};

/* 旋转光环 */
const logoStyle = ref({});
const rotationStyle = ref({});

const initStyle = () => {
  const now = new Date();
  const seconds = now.getSeconds();
  const animationDelay = `-${seconds}s`;
  logoStyle.value = {
    'animation-delay': animationDelay,
    'background-image': 'linear-gradient(135deg, #e7604a, #de6262)',
  };
  rotationStyle.value = {
    display: 'block',
    'animation-delay': animationDelay,
  };
};

onMounted(() => {
  initStyle();
});
</script>

<style scoped>
.header {
  display: flex;
  cursor: pointer;
}

/* LOGO */
.sidebar-logo {
  display: block;
  background-image: -webkit-linear-gradient(135deg, #333, #333);
  background-image: linear-gradient(135deg, #333, #333);
  animation: hue 60s linear infinite;
  padding: 4px;
  width: 200px;
  height: 80px;
}

@-webkit-keyframes hue {
  from {
    -webkit-filter: hue-rotate(0deg);
    filter: hue-rotate(0deg);
  }

  to {
    -webkit-filter: hue-rotate(-360deg);
    filter: hue-rotate(-360deg);
  }
}

@keyframes hue {
  from {
    -webkit-filter: hue-rotate(0deg);
    filter: hue-rotate(0deg);
  }

  to {
    -webkit-filter: hue-rotate(-360deg);
    filter: hue-rotate(-360deg);
  }
}

.sidebar-logo img {
  height: 72px;
  width: 72px;
}

.logo-rotation {
  display: none;
  -webkit-animation: rotation linear 30s infinite;
  animation: rotation linear 30s infinite;
}

@-webkit-keyframes rotation {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes rotation {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

/* 菜单 */
.side-menu {
  max-height: calc(100vh - var(--header-height));
  overflow-y: auto;
}

.side-menu-icon {
  width: 12px;
  height: 12px;
  transform: scale(1.6);
}
</style>
