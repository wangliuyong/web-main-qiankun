<template>
  <view class="kid-tabbar">
    <view
      v-for="(tab, index) in tabs"
      :key="tab.path"
      class="tab-item"
      @click="onTabClick(index)"
    >
      <text class="tab-icon" :class="{ 'tab-icon-active': current === index }">{{ tab.icon }}</text>
      <text class="tab-label" :class="{ 'tab-label-active': current === index }">{{ tab.label }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useKidsStore } from '@/stores/kids';

interface TabItem {
  icon: string;
  label: string;
  path: string;
}

const tabs: TabItem[] = [
  { icon: '📚', label: '学习', path: '/pages/home/index' },
  { icon: '🖌️', label: '画板', path: '/pages/studio/index' },
  { icon: '🖼️', label: '作品', path: '/pages/gallery/index' },
  { icon: '👤', label: '我的', path: '/pages/profile/index' },
];

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
  background-color: #ffffff;
  border-top: 3px solid #2d3436;
  padding: 6px 0 calc(6px + env(safe-area-inset-bottom));
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 56px;
}

.tab-icon {
  font-size: 24px;
  opacity: 0.5;
}

.tab-icon-active {
  opacity: 1;
}

.tab-label {
  font-size: 12px;
  color: #636e72;
  margin-top: 2px;
}

.tab-label-active {
  color: #2d3436;
  font-weight: bold;
}
</style>
