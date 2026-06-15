<template>
  <view class="category-hero">
    <view class="category-hero__glow" />
    <view class="category-hero__main">
      <text class="category-hero__title">全部分类</text>
      <text class="category-hero__desc">按类别浏览同城便民信息</text>
    </view>
    <view class="category-hero__stats">
      <view class="category-hero__stat">
        <text class="category-hero__stat-num">{{ rootCount }}</text>
        <text class="category-hero__stat-label">大类</text>
      </view>
      <view class="category-hero__stat-divider" />
      <view class="category-hero__stat">
        <text class="category-hero__stat-num">{{ subCount }}</text>
        <text class="category-hero__stat-label">子类</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  rootCount: number;
  subCount: number;
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.category-hero {
  position: relative;
  overflow: hidden;
  @include cv-hero-bg;
  padding: 28rpx $cv-space-page 52rpx;
  @include cv-safe-area-top(28rpx);
}

.category-hero__glow {
  @include cv-hero-orb(280rpx, -40rpx, -50rpx);
}

.category-hero__main {
  position: relative;
  z-index: 1;
}

.category-hero__title {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.05em;
}

.category-hero__desc {
  display: block;
  margin-top: 10rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.45;
}

.category-hero__stats {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-top: 28rpx;
  padding: 20rpx 28rpx;
  border-radius: $cv-radius-sm;
  background: rgba(255, 255, 255, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.16);
  width: fit-content;
}

.category-hero__stat {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.category-hero__stat-num {
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.04em;
}

.category-hero__stat-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.72);
}

.category-hero__stat-divider {
  width: 1rpx;
  height: 32rpx;
  background: rgba(255, 255, 255, 0.2);
}
</style>
