<template>
  <view v-for="skIdx in 4" :key="skIdx" class="publish-skeleton cv-card publish-skeleton__section">
    <view class="publish-skeleton__head">
      <SkeletonBlock width="48rpx" height="48rpx" radius="50%" :shimmer="true" />
      <view class="publish-skeleton__meta">
        <SkeletonLine variant="short" width="160rpx" />
        <SkeletonLine variant="mid" width="280rpx" />
      </view>
    </view>
    <SkeletonBlock height="120rpx" radius="16rpx" :shimmer="true" />
    <SkeletonBlock v-if="skIdx <= 2" height="200rpx" radius="16rpx" :shimmer="true" />
  </view>
</template>

<script setup lang="ts">
import SkeletonBlock from '@/components/SkeletonBlock/SkeletonBlock.vue';
import SkeletonLine from '@/components/SkeletonLine/SkeletonLine.vue';
</script>

<style lang="scss" scoped>
.publish-skeleton__section {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 20rpx;
  padding: 28rpx 28rpx 32rpx;
}

.publish-skeleton__head {
  display: flex;
  align-items: flex-start;
  gap: 18rpx;
}

.publish-skeleton__meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
</style>
