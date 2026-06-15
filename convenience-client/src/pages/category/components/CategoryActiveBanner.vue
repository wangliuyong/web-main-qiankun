<template>
  <view
    v-if="root"
    class="category-banner"
    :class="`category-banner--tone-${toneIndex % 5}`"
  >
    <view class="category-banner__icon">
      <u-icon :name="iconName" color="#fff" size="22" />
    </view>
    <view class="category-banner__text">
      <text class="category-banner__name">{{ root.name }}</text>
      <text class="category-banner__hint">{{ hint }}</text>
    </view>
    <view class="category-banner__count">
      <text class="category-banner__count-num">{{ childCount }}</text>
      <text class="category-banner__count-label">个子类</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getCategoryRootHint, getCategoryRootIcon } from '@/constants/category';
import type { CategoryItem } from '@/types/city-info';

const props = defineProps<{
  root: CategoryItem | undefined;
  toneIndex: number;
  childCount: number;
}>();

const iconName = computed(() => (props.root ? getCategoryRootIcon(props.root.id) : ''));
const hint = computed(() => (props.root ? getCategoryRootHint(props.root.id) : ''));
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.category-banner {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 24rpx;
  border-radius: $cv-radius-card;
  margin-bottom: 20rpx;
  box-shadow: 0 14rpx 40rpx rgba(11, 18, 32, 0.16);
  overflow: hidden;

  &--tone-0 { background: $cv-cat-1; }
  &--tone-1 { background: $cv-cat-2; }
  &--tone-2 { background: $cv-cat-3; }
  &--tone-3 { background: $cv-cat-4; }
  &--tone-4 { background: $cv-cat-5; }
}

.category-banner__icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 22rpx;
  background: rgba(255, 255, 255, 0.14);
  border: 1rpx solid rgba(255, 255, 255, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.category-banner__text {
  flex: 1;
  min-width: 0;
}

.category-banner__name {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.03em;
}

.category-banner__hint {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.72);
}

.category-banner__count {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12rpx 18rpx;
  border-radius: $cv-radius-sm;
  background: rgba(255, 255, 255, 0.12);
  border: 1rpx solid rgba(255, 255, 255, 0.18);
  flex-shrink: 0;
}

.category-banner__count-num {
  font-size: 30rpx;
  font-weight: 700;
  color: #fff;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.category-banner__count-label {
  margin-top: 4rpx;
  font-size: 18rpx;
  color: rgba(255, 255, 255, 0.72);
}
</style>
