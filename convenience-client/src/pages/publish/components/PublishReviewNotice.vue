<template>
  <view class="publish-notice">
    <u-icon name="info-circle" color="#8b9bb8" size="14" />
    <text>提交后将进入人工审核，通过后展示在首页与分类列表</text>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.publish-notice {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  padding: 0 8rpx 16rpx;
  font-size: 24rpx;
  color: $cv-text-muted;
  line-height: 1.55;
}
</style>
