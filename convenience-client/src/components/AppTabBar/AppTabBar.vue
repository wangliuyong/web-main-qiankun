<template>
  <!--
    Tab 页底部导航
    - 微信小程序：由 custom-tab-bar/index.vue 单例挂载
    - H5 / App：各 Tab 页挂载并传 page-path，避免多实例叠层
    - 沉浸式 Tab（AI）不展示
  -->
  <view v-show="visible" class="app-tabbar">
    <u-tabbar :value="tabBarStore.activeIndex" :fixed="true" :placeholder="true" :safe-area-inset-bottom="true"
      :border="false" :active-color="TAB_BAR_ACTIVE_COLOR" :inactive-color="TAB_BAR_INACTIVE_COLOR"
      :background-color="TAB_BAR_BG" :z-index="1000" @change="onTabChange">
      <u-tabbar-item
        v-for="item in TAB_BAR_ITEMS"
        :key="item.name"
        :name="item.name"
        :text="item.midButton ? ' ' : item.text"
      >
        <template v-if="item.iconPath && item.selectedIconPath && !item.midButton" #inactive-icon>
          <image class="app-tabbar__icon" :src="item.iconPath" mode="aspectFit" />
        </template>
        <template v-if="item.iconPath && item.selectedIconPath && !item.midButton" #active-icon>
          <image class="app-tabbar__icon" :src="item.selectedIconPath" mode="aspectFit" />
        </template>
      </u-tabbar-item>
    </u-tabbar>

    <!-- 中间发布：纯 view + text，全端一致，不依赖 uview 字体图标 -->
    <view class="app-tabbar__publish" hover-class="app-tabbar__publish--pressed" @tap.stop="onPublishTap">
      <view class="app-tabbar__publish-circle">
        <text class="app-tabbar__publish-plus">+</text>
      </view>
      <!-- <text class="app-tabbar__publish-label">发布</text> -->
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  TAB_BAR_ACTIVE_COLOR,
  TAB_BAR_BG,
  TAB_BAR_INACTIVE_COLOR,
  TAB_BAR_ITEMS,
  isTabBarHiddenPath,
  isTabSwitchPath,
  normalizeRoute,
} from '@/constants/tabbar';
import { useTabBarStore } from '@/stores/tabbar';

/** 发布 Tab 在 TAB_BAR_ITEMS 中的索引 */
const PUBLISH_TAB_INDEX = TAB_BAR_ITEMS.findIndex((item) => item.midButton);

const props = defineProps<{
  /** H5 / App 各 Tab 页挂载时必传，用于多实例间仅展示当前页那一个 */
  pagePath?: string;
}>();

const tabBarStore = useTabBarStore();

/** 是否展示 TabBar：store 路由驱动；微信单例由 custom-tab-bar 挂载 */
const visible = computed(() => {
  const currentRoute = tabBarStore.currentRoute;
  if (!currentRoute) return false;
  if (isTabBarHiddenPath(currentRoute)) return false;
  if (!isTabSwitchPath(currentRoute)) return false;

  // #ifdef MP-WEIXIN
  return true;
  // #endif

  // #ifndef MP-WEIXIN
  const pagePath = props.pagePath ?? '';
  if (!pagePath) return false;
  return currentRoute === normalizeRoute(pagePath);
  // #endif
});

/** u-tabbar 切换回调 */
function onTabChange(name: string | number) {
  tabBarStore.switchTo(Number(name));
}

/** 点击中间发布按钮 */
function onPublishTap() {
  if (PUBLISH_TAB_INDEX < 0) return;
  tabBarStore.switchTo(PUBLISH_TAB_INDEX);
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

:deep(.u-tabbar__content) {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 -8rpx 40rpx rgba(29, 78, 216, 0.1);
  border-top: 1rpx solid $cv-border !important;
}

/** 5 Tab 紧凑排版 */
:deep(.u-tabbar-item__text) {
  font-size: 20rpx !important;
  line-height: 1.2;
}

:deep(.u-tabbar-item) {
  padding: 0 4rpx;
}

.app-tabbar__icon {
  width: 44rpx;
  height: 44rpx;
  display: block;
}

/** 第 3 项为发布占位：保留宽度，视觉由浮层承担 */
:deep(.u-tabbar-item:nth-child(3)) {

  .u-tabbar-item__icon,
  .u-tabbar-item__text {
    opacity: 0;
    pointer-events: none;
  }
}

/** 中间发布浮层：fixed 与 u-tabbar 对齐 */
.app-tabbar__publish {
  position: fixed;
  left: 50%;
  bottom: calc(10rpx + env(safe-area-inset-bottom));
  transform: translateX(-50%);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120rpx;
}

.app-tabbar__publish--pressed {
  opacity: 0.88;
}

.app-tabbar__publish-circle {
  width: 112rpx;
  height: 112rpx;
  margin-top: -36rpx;
  border-radius: 50%;
  background: $cv-primary;
  box-shadow: 0 12rpx 32rpx rgba(29, 78, 216, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-tabbar__publish-plus {
  color: #ffffff;
  font-size: 64rpx;
  font-weight: 300;
  line-height: 1;
  margin-top: -6rpx;
}

.app-tabbar__publish-label {
  margin-top: 4rpx;
  font-size: 20rpx;
  line-height: 1.2;
  color: $cv-text-muted;
}
</style>
