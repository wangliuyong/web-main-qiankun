import { defineStore } from 'pinia';
import {
  applyH5SafeAreaCssVars,
  buildNavPaddingTop,
  buildSafeAreaCssVars,
  querySafeAreaInsets,
  type SafeAreaInsets,
} from '@/utils/safe-area';

/**
 * 全局安全区 Store
 * App 启动时初始化，供各自定义导航页注入 CSS 变量
 */
export const useSafeAreaStore = defineStore('safeArea', {
  state: () => ({
    inited: false,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),

  getters: {
    /** 绑定到页面根 view 的 style，子节点可继承 --cv-safe-top */
    pageCssVars(): Record<string, string> {
      return buildSafeAreaCssVars({
        top: this.top,
        bottom: this.bottom,
        left: this.left,
        right: this.right,
      });
    },

    /** 沉浸式顶栏 / 浮动返回按钮的上内边距 */
    navPaddingTop(): string {
      return buildNavPaddingTop(this.top);
    },
  },

  actions: {
    /** 读取系统安全区并缓存（可重复调用，仅首次写入） */
    init(force = false) {
      if (this.inited && !force) return;

      const insets: SafeAreaInsets = querySafeAreaInsets();
      this.top = insets.top;
      this.bottom = insets.bottom;
      this.left = insets.left;
      this.right = insets.right;
      this.inited = true;

      applyH5SafeAreaCssVars(insets);
    },
  },
});
