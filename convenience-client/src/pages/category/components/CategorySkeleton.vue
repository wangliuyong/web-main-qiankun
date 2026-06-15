<template>
  <view class="category-skeleton">
    <view class="category-skeleton__hero">
      <view class="category-skeleton__hero-glow" />
      <view class="category-skeleton__hero-main">
        <SkeletonLine variant="lg" width="200rpx" :shimmer="true" />
        <SkeletonLine variant="mid" width="320rpx" />
      </view>
      <view class="category-skeleton__stats">
        <SkeletonBlock width="120rpx" height="72rpx" radius="12rpx" :shimmer="true" />
        <SkeletonBlock width="120rpx" height="72rpx" radius="12rpx" :shimmer="true" />
      </view>
    </view>
    <view class="category-skeleton__body">
      <view class="category-skeleton__roots cv-card">
        <SkeletonBlock
          v-for="i in 5"
          :key="i"
          width="140rpx"
          height="64rpx"
          radius="32rpx"
          :shimmer="true"
        />
      </view>
      <SkeletonBlock height="120rpx" radius="20rpx" :shimmer="true" />
      <view class="category-skeleton__subs">
        <SkeletonBlock v-for="i in 8" :key="i" height="120rpx" radius="16rpx" :shimmer="true" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import SkeletonBlock from '@/components/SkeletonBlock/SkeletonBlock.vue';
import SkeletonLine from '@/components/SkeletonLine/SkeletonLine.vue';
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.category-skeleton__hero {
  position: relative;
  overflow: hidden;
  @include cv-hero-bg;
  padding: 28rpx $cv-space-page 52rpx;
  @include cv-safe-area-top(28rpx);
}

.category-skeleton__hero-glow {
  @include cv-hero-orb(280rpx, -40rpx, -50rpx);
}

.category-skeleton__hero-main {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.category-skeleton__stats {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  gap: 48rpx;
  margin-top: 28rpx;
  padding: 20rpx 28rpx;
  border-radius: $cv-radius-sm;
  background: rgba(255, 255, 255, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.16);
  width: fit-content;
}

.category-skeleton__body {
  @include cv-body-sheet;
  margin-top: -36rpx;
}

.category-skeleton__roots {
  display: flex;
  flex-wrap: nowrap;
  gap: 16rpx;
  padding: 24rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
}

.category-skeleton__subs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  padding-bottom: 16rpx;
}
</style>
