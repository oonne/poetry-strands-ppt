<template>
  <!-- 标题 -->
  <div class="title">
    {{ title }}
  </div>

  <!--用户 -->
  <a-dropdown
    :trigger="['click']"
    placement="bottomRight"
  >
    <!-- 头像和在线状态 -->
    <div class="user">
      {{ staffInfo.name }}
      <span class="arrow-down" />
    </div>

    <template #overlay>
      <a-menu>
        <!-- 退出登录 -->
        <a-menu-item @click="logout">
          退出登录
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter, RouteLocationNormalizedLoaded } from 'vue-router';
import { useStaffStore } from '@/store/index';
import { Type, Feedback } from '@/utils/index';
import useEventOn from '@/hooks/use-event-on';

const { isString } = Type;
const { confirmModal } = Feedback;
const staffStore = useStaffStore();
const { staffInfo } = storeToRefs(staffStore);

/*
 * 设置Title
 */
const title = ref<string>('');
const updateTitle = (raw: RouteLocationNormalizedLoaded) => {
  title.value = isString(raw.meta?.title) ? raw.meta.title : '';
};

// 监听路由更新
const route = useRoute();
const router = useRouter();
updateTitle(route);
router.afterEach((toRoute) => {
  updateTitle(toRoute);
});

// 监听页面修改标题
useEventOn('UPDATE_PAGE_TITLE', 'layout-header', (text: string) => {
  title.value = text;
});

/*
 * 退出登录
 */
const logout = async () => {
  const confirm = await confirmModal({
    content: '确定退出登录？',
  });

  if (!confirm) {
    return;
  }

  staffStore.clear();
  router.replace({
    name: 'login',
  });

  message.success('已退出登录');
};
</script>

<style scoped>
.title {
  font-size: 14px;
  color: #666;
}

.user {
  position: relative;
  display: flex;
  align-items: center;
  height: 36px;
  border-radius: 36px;
  background-color: #eee;
  padding: 0 18px;
  cursor: pointer;
}
.arrow-down {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 5px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #666;
}
</style>
