<template>
  <view class="mine-actions">
    <view
      v-for="action in actions"
      :key="action.key"
      class="mine-actions__item cv-card"
      :class="[`mine-actions__item--${action.tone}`]"
      @click="action.onTap"
    >
      <view class="mine-actions__icon">
        <u-icon :name="action.icon" color="#fff" size="20" />
      </view>
      <view class="mine-actions__text">
        <text class="mine-actions__title">{{ action.title }}</text>
        <text class="mine-actions__desc">{{ action.desc }}</text>
      </view>
      <u-icon name="arrow-right" color="#cbd5e1" size="14" />
    </view>
  </view>
</template>

<script setup lang="ts">
import type { MineQuickAction } from '../composables/useMinePage';

defineProps<{
  actions: MineQuickAction[];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.mine-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-top: 20rpx;
}

.mine-actions__item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 20rpx;
  @include cv-pressable;
}

.mine-actions__icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mine-actions__item--blue .mine-actions__icon {
  background: linear-gradient(155deg, $cv-hero-ink 0%, $cv-primary 100%);
}

.mine-actions__item--ink .mine-actions__icon {
  background: $cv-cat-1;
}

.mine-actions__item--teal .mine-actions__icon {
  background: $cv-cat-3;
}

.mine-actions__item--slate .mine-actions__icon {
  background: $cv-cat-2;
}

.mine-actions__text {
  flex: 1;
  min-width: 0;
}

.mine-actions__title {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.02em;
}

.mine-actions__desc {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: $cv-text-muted;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
