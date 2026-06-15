<template>
  <view class="publish-hero">
    <view class="publish-hero__orb publish-hero__orb--1" />
    <view class="publish-hero__orb publish-hero__orb--2" />
    <view class="publish-hero__nav">
      <view class="publish-hero__back" hover-class="publish-hero__back--pressed" @click="emit('back')">
        <u-icon name="arrow-left" color="#fff" size="18" />
      </view>
    </view>
    <text class="publish-hero__title">发布便民信息</text>
    <text class="publish-hero__desc">真实、清晰的信息更容易被同城用户看到</text>
    <view class="publish-hero__progress">
      <view class="publish-hero__progress-track">
        <view class="publish-hero__progress-fill" :style="{ width: `${completionPercent}%` }" />
      </view>
      <text class="publish-hero__progress-label">必填 {{ completionCount }}/3</text>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  /** 必填进度百分比 */
  completionPercent: number;
  /** 已完成必填项数量 */
  completionCount: number;
}>();

const emit = defineEmits<{
  back: [];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.publish-hero {
  position: relative;
  overflow: hidden;
  @include cv-hero-bg;
  padding: 28rpx $cv-space-page 48rpx;
  @include cv-safe-area-top(28rpx);
}

.publish-hero__nav {
  position: relative;
  z-index: 2;
  margin-bottom: 8rpx;
}

.publish-hero__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.12);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.publish-hero__back--pressed {
  opacity: 0.82;
  transform: scale(0.96);
}

.publish-hero__orb {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1rpx solid rgba(255, 255, 255, 0.12);
  pointer-events: none;
}

.publish-hero__orb--1 {
  width: 220rpx;
  height: 220rpx;
  right: -40rpx;
  top: -20rpx;
}

.publish-hero__orb--2 {
  width: 120rpx;
  height: 120rpx;
  left: -20rpx;
  bottom: 16rpx;
}

.publish-hero__title {
  position: relative;
  z-index: 1;
  display: block;
  font-size: 44rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.05em;
}

.publish-hero__desc {
  position: relative;
  z-index: 1;
  display: block;
  margin-top: 10rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.5;
  max-width: 560rpx;
}

.publish-hero__progress {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-top: 28rpx;
}

.publish-hero__progress-track {
  flex: 1;
  height: 8rpx;
  border-radius: $cv-radius-pill;
  background: rgba(255, 255, 255, 0.18);
  overflow: hidden;
}

.publish-hero__progress-fill {
  height: 100%;
  border-radius: $cv-radius-pill;
  background: linear-gradient(90deg, #fff 0%, rgba(255, 255, 255, 0.72) 100%);
  transition: width 0.35s $cv-ease-out;
}

.publish-hero__progress-label {
  font-size: 22rpx;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}
</style>
