/** 安全区边距（单位 px，与 uni.getWindowInfo 一致） */
export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * 查询设备安全区
 * - App / 小程序：优先 safeAreaInsets，回退 statusBarHeight
 * - H5：statusBarHeight 常为 0，由 CSS env() 与 max() 兜底
 */
export function querySafeAreaInsets(): SafeAreaInsets {
  let top = 0;
  let bottom = 0;
  let left = 0;
  let right = 0;

  try {
    const win = uni.getWindowInfo();
    top = win.safeAreaInsets?.top ?? win.statusBarHeight ?? 0;
    bottom = win.safeAreaInsets?.bottom ?? 0;
    left = win.safeAreaInsets?.left ?? 0;
    right = win.safeAreaInsets?.right ?? 0;
  } catch {
    const sys = uni.getSystemInfoSync();
    top = sys.statusBarHeight || 0;
    const safe = sys.safeArea;
    if (safe) {
      bottom = Math.max(0, (sys.screenHeight || 0) - safe.bottom);
      left = safe.left || 0;
      right = Math.max(0, (sys.screenWidth || 0) - safe.right);
    }
  }

  return { top, bottom, left, right };
}

/** 悬浮导航栏顶部内边距：状态栏 + 8px 呼吸间距 */
export function buildNavPaddingTop(top: number, extra = 8): string {
  return `${top + extra}px`;
}

/** 页面根节点注入的 CSS 变量 */
export function buildSafeAreaCssVars(insets: SafeAreaInsets): Record<string, string> {
  return {
    '--cv-safe-top': `${insets.top}px`,
    '--cv-safe-bottom': `${insets.bottom}px`,
    '--cv-safe-left': `${insets.left}px`,
    '--cv-safe-right': `${insets.right}px`,
  };
}

/**
 * H5 写入 document 级变量，供未绑定 pageStyle 的节点兜底
 */
export function applyH5SafeAreaCssVars(insets: SafeAreaInsets) {
  // #ifdef H5
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--cv-safe-top', `${insets.top}px`);
  root.style.setProperty('--cv-safe-bottom', `${insets.bottom}px`);
  root.style.setProperty('--cv-safe-left', `${insets.left}px`);
  root.style.setProperty('--cv-safe-right', `${insets.right}px`);
  // #endif
}
