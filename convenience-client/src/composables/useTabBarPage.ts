import { onShow } from '@dcloudio/uni-app';
import { useTabBarStore } from '@/stores/tabbar';

/**
 * 隐藏原生 TabBar（H5 / App 仍需手动隐藏；微信 custom:true 已由框架接管）
 */
function hideNativeTabBar() {
  // #ifdef H5 || APP-PLUS
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
