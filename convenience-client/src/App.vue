<script setup lang="ts">
import { onLaunch, onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';
import { useLocationStore } from '@/stores/location';

/** 隐藏 H5 / App 原生 TabBar（微信小程序 tabBar.custom 已由框架隐藏原生栏） */
function hideNativeTabBar() {
  // #ifdef H5 || APP-PLUS
  uni.hideTabBar({ animation: false, fail: () => {} });
  // #endif
}

/** 应用启动时恢复登录态 */
onLaunch(() => {
  const userStore = useUserStore();
  userStore.restoreFromStorage();
  useLocationStore().restoreFromStorage();
  hideNativeTabBar();
});

/** App 切回前台时再次隐藏原生 TabBar */
onShow(() => {
  hideNativeTabBar();
});
</script>

<style lang="scss">
@import '@/styles/tokens.scss';
@import '@/styles/global.scss';
@import 'uview-plus/index.scss';

page {
  --up-primary: #{$cv-primary};
  --up-primary-dark: #{$cv-primary-dark};
  --up-primary-light: #{$cv-primary-light};
  --u-primary: #{$cv-primary};
  --u-primary-dark: #{$cv-primary-dark};
  --u-primary-light: #{$cv-primary-light};
  --cv-primary: #{$cv-primary};
  --cv-accent: #{$cv-accent};
  --cv-bg: #{$cv-bg};
  --cv-text: #{$cv-text};

  background-color: $cv-bg;
  color: $cv-text;
  font-size: 28rpx;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'SF Pro Display', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.01em;
}
</style>
