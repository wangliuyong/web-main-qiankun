import { computed } from 'vue';
import { useSafeAreaStore } from '@/stores/safe-area';

/**
 * 顶部安全区 composable（App / 小程序 / H5 通用）
 *
 * 用法：
 * 1. 页面根节点绑定 :style="pageStyle"
 * 2. 样式使用 @include cv-safe-area-top(28rpx) 或 var(--cv-safe-top)
 */
export function useSafeAreaInsets() {
  const store = useSafeAreaStore();
  store.init();

  return {
    /** 状态栏高度 px */
    safeTop: computed(() => store.top),
    /** 底部安全区 px */
    safeBottom: computed(() => store.bottom),
    /** 页面根节点 style，注入 --cv-safe-top 等变量 */
    pageStyle: computed(() => store.pageCssVars),
    /** 浮动导航栏 padding-top */
    navPaddingTop: computed(() => store.navPaddingTop),
  };
}
