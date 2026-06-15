<template>
  <view class="kid-tabbar">
    <view
      v-for="(tab, index) in tabs"
      :key="tab.path"
      class="tab-item"
      :class="{ 'tab-item-active': current === index }"
      @click="onTabClick(index)"
    >
      <text class="tab-icon" :class="{ 'tab-icon-bounce': current === index }">{{ tab.icon }}</text>
      <text class="tab-label">{{ tab.label }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { TAB_ITEMS } from '@/constants/theme';
import { useKidsStore } from '@/stores/kids';

/** Tab 配置：小动物主题导航 */
const tabs = TAB_ITEMS;

const props = withDefaults(defineProps<{ current?: number }>(), { current: 0 });

const kidsStore = useKidsStore();

function onTabClick(index: number): void {
  if (index === props.current) return;
  kidsStore.setTabIndex(index);
  uni.redirectTo({ url: tabs[index].path });
}
</script>

<style lang="scss" scoped>
.kid-tabbar {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  background: linear-gradient(180deg, $kd-surface 0%, $kd-surface-soft 100%);
  border-top: $kd-border-width solid $kd-border-color;
  padding: $kd-space-xs 0 calc(#{$kd-space-xs} + var(--kd-safe-bottom));
  box-shadow: 0 -4px 20px rgba(205, 180, 219, 0.2);

  @include kd-landscape {
    flex-direction: column;
    width: $kd-sidebar-width;
    height: auto;
    align-self: stretch;
    border-top: none;
    border-right: $kd-border-width solid $kd-border-color;
    padding: $kd-space-lg $kd-space-xs;
    padding-left: calc(#{$kd-space-xs} + var(--kd-safe-left));
    padding-bottom: calc(#{$kd-space-lg} + var(--kd-safe-bottom));
    box-shadow: 4px 0 20px rgba(205, 180, 219, 0.18);
  }
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: $kd-touch-lg;
  border-radius: $kd-radius-md;
  margin: 0 4px;
  transition: background-color 0.25s ease, transform 0.2s ease;

  @include kd-landscape {
    flex: 0 0 auto;
    width: 100%;
    min-height: 72px;
    margin: 6px 0;
  }

  &:active {
    transform: scale(0.94);
  }
}

.tab-item-active {
  background: linear-gradient(135deg, rgba(255, 181, 197, 0.5) 0%, rgba(205, 180, 219, 0.4) 100%);

  @include kd-landscape {
    border: 2px solid $kd-pink-deep;
    box-shadow: $kd-shadow-card;
  }
}

.tab-icon {
  font-size: 26px;
  opacity: 0.65;
  transition: opacity 0.2s ease;

  @include kd-landscape {
    font-size: 30px;
  }
}

.tab-item-active .tab-icon {
  opacity: 1;
}

.tab-icon-bounce {
  @include kd-animate(kd-bounce-in, 0.4s, ease);
}

.tab-label {
  font-size: $kd-text-xs;
  color: $kd-ink-muted;
  margin-top: 2px;
  font-weight: 500;

  @include kd-landscape {
    font-size: $kd-text-sm;
  }
}

.tab-item-active .tab-label {
  color: $kd-ink;
  font-weight: bold;
}
</style>
