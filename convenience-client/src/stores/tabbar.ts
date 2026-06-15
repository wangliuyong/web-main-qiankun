import { defineStore } from 'pinia';
import {
  isTabBarHiddenPath,
  isTabSwitchPath,
  normalizeRoute,
  PUBLISH_PAGE_PATH,
  TAB_BAR_ITEMS,
  navigateToPublishPage,
} from '@/constants/tabbar';

/**
 * 自定义 TabBar 选中态
 * 各 Tab 页 onShow 时调用 syncFromRoute，与当前路由对齐
 */
export const useTabBarStore = defineStore('tabbar', {
  state: () => ({
    activeIndex: 0,
    /** 沉浸式 Tab 页（AI）：隐藏底部 TabBar */
    tabBarHidden: false,
    /** 当前栈顶路由（驱动 TabBar 显隐与高亮） */
    currentRoute: 'pages/home/index',
  }),
  actions: {
    /** 写入当前路由并同步高亮态 */
    applyRoute(route: string) {
      const normalized = normalizeRoute(route);
      this.currentRoute = normalized;
      this.tabBarHidden = isTabBarHiddenPath(normalized);
      const index = TAB_BAR_ITEMS.findIndex((item) => item.pagePath === normalized);
      // 发布为独立子页，不更新 Tab 高亮
      if (index >= 0 && normalized !== PUBLISH_PAGE_PATH) {
        this.activeIndex = index;
      }
    },

    /** 根据当前页面路由同步高亮项与 TabBar 显隐 */
    syncFromRoute() {
      const pages = getCurrentPages();
      const route = normalizeRoute(pages[pages.length - 1]?.route ?? '');
      this.applyRoute(route);
    },

    /** 切换 Tab 或打开发布子页 */
    switchTo(index: number) {
      const target = TAB_BAR_ITEMS[index];
      if (!target) return;

      // 发布：独立子页，APP / 小程序均走 navigateTo（含栈内降级）
      if (target.pagePath === PUBLISH_PAGE_PATH || target.switchTab === false) {
        // 立即更新路由态，避免跳转过渡期间 TabBar 露出
        this.applyRoute(PUBLISH_PAGE_PATH);
        navigateToPublishPage();
        return;
      }

      if (index === this.activeIndex && this.currentRoute === target.pagePath) return;

      // 乐观更新：switchTab 动画期间先隐藏旧页 TabBar，避免高亮与页面错位闪烁
      this.applyRoute(target.pagePath);
      uni.switchTab({ url: `/${target.pagePath}` });
    },
    /** 当前栈顶是否为 switchTab Tab 页（用于 AppTabBar 显隐） */
    isTopTabSwitchPage(): boolean {
      const pages = getCurrentPages();
      const route = normalizeRoute(pages[pages.length - 1]?.route ?? '');
      return isTabSwitchPath(route) && !isTabBarHiddenPath(route);
    },
  },
});
