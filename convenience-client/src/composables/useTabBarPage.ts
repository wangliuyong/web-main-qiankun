import { onShow } from '@dcloudio/uni-app';
import { useTabBarStore } from '@/stores/tabbar';

/** 隐藏原生 TabBar，避免与 AppTabBar 叠层闪烁 */
function hideNativeTabBar() {
  // #ifdef MP-WEIXIN || APP-PLUS || H5
  uni.hideTabBar({ animation: false, fail: () => {} });
  // #endif
}

/**
 * Tab 页生命周期：每次展示时同步底部导航高亮
 */
export function useTabBarPage() {
  const tabBarStore = useTabBarStore();

  onShow(() => {
    hideNativeTabBar();
    tabBarStore.syncFromRoute();
  });
}
