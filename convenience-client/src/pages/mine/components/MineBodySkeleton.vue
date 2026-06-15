<template>
  <view class="mine-body-skeleton">
    <view class="mine-body-skeleton__stats cv-card--elevated">
      <SkeletonBlock v-for="i in 3" :key="i" height="80rpx" radius="12rpx" :shimmer="true" flex="1" />
    </view>
    <view class="mine-body-skeleton__actions">
      <view v-for="i in 3" :key="i" class="mine-body-skeleton__action cv-card">
        <SkeletonBlock width="72rpx" height="72rpx" radius="22rpx" :shimmer="true" />
        <view class="mine-body-skeleton__action-text">
          <SkeletonLine variant="short" />
          <SkeletonLine variant="mid" />
        </view>
      </view>
    </view>
    <view class="mine-body-skeleton__recent">
      <SkeletonLine variant="short" width="160rpx" />
      <view class="mine-body-skeleton__recent-block cv-card">
        <SkeletonList :count="2" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import SkeletonBlock from '@/components/SkeletonBlock/SkeletonBlock.vue';
import SkeletonLine from '@/components/SkeletonLine/SkeletonLine.vue';
import SkeletonList from '@/components/SkeletonList/SkeletonList.vue';
</script>

<style lang="scss" scoped>
.mine-body-skeleton__stats {
  display: flex;
  gap: 24rpx;
  padding: 32rpx 24rpx;
}

.mine-body-skeleton__actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-top: 20rpx;
}

.mine-body-skeleton__action {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx 24rpx;
}

.mine-body-skeleton__action-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.mine-body-skeleton__recent {
  margin-top: 32rpx;
}

.mine-body-skeleton__recent-block {
  margin-top: 16rpx;
  padding: 0;
  overflow: hidden;
  border: none;
  background: transparent;
  box-shadow: none;
}
</style>
