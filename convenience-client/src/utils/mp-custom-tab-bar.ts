import { isTabBarHiddenPath, isTabSwitchPath } from '@/constants/tabbar';

/** 微信自定义 TabBar 组件实例（原生 setData） */
interface MpCustomTabBarInstance {
  setData?: (data: Record<string, unknown>) => void;
}

/** 带 getTabBar 的页面实例 */
type MpPageWithTabBar = UniApp.PageInstance & {
  getTabBar?: (
    callback?: (tabBar: MpCustomTabBarInstance) => void,
  ) => MpCustomTabBarInstance | void;
};

export interface MpCustomTabBarPayload {
  selected: number;
  show: boolean;
}

/** 根据路由计算 custom-tab-bar 显隐 */
export function resolveMpCustomTabBarPayload(
  route: string,
  activeIndex: number,
): MpCustomTabBarPayload {
  const show = isTabSwitchPath(route) && !isTabBarHiddenPath(route);
  return { selected: activeIndex, show };
}

/**
 * 同步微信 custom-tab-bar 选中态与显隐
 * 在 Tab 页 onShow 与 switchTo 乐观更新后调用
 */
export function syncMpCustomTabBar(payload: MpCustomTabBarPayload) {
  // #ifdef MP-WEIXIN
  const pages = getCurrentPages();
  const page = pages[pages.length - 1] as MpPageWithTabBar | undefined;
  if (!page || typeof page.getTabBar !== 'function') return;

  const apply = (instance?: MpCustomTabBarInstance | null) => {
    instance?.setData?.(payload);
  };

  try {
    const tabBar = page.getTabBar();
    if (tabBar) {
      apply(tabBar);
      return;
    }
  } catch {
    // skyline 等场景走回调
  }

  page.getTabBar((instance) => {
    apply(instance);
  });
  // #endif
}
