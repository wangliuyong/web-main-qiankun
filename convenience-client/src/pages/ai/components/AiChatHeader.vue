<template>
  <view class="ai-header">
    <view class="ai-header__glow" />
    <view class="ai-header__row">
      <view class="ai-header__back" hover-class="ai-header__back--pressed" @tap.stop="emit('back')">
        <u-icon name="arrow-left" color="rgba(255,255,255,0.92)" size="18" />
      </view>
      <view class="ai-header__brand">
        <view class="ai-header__avatar">
          <u-icon name="chat-fill" color="#fff" size="22" />
        </view>
        <view class="ai-header__brand-text">
          <text class="ai-header__title">便民 AI</text>
          <text class="ai-header__desc">搜索同城信息 · 办事指南 · 常见问题</text>
        </view>
      </view>
      <view class="ai-header__history-btn" @click="emit('history')">
        <u-icon name="clock" color="rgba(255,255,255,0.9)" size="16" />
        <text>历史</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  back: [];
  history: [];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.ai-header {
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
  @include cv-hero-bg;
  padding: 20rpx $cv-space-page 28rpx;
  @include cv-safe-area-top(20rpx);
}

.ai-header__glow {
  @include cv-hero-orb(260rpx, -50rpx, -40rpx);
}

.ai-header__row {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.ai-header__back {
  position: relative;
  z-index: 2;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  @include cv-pressable;
}

.ai-header__back--pressed {
  transform: scale(0.96);
  opacity: 0.88;
}

.ai-header__brand {
  display: flex;
  align-items: center;
  gap: 18rpx;
  flex: 1;
  min-width: 0;
}

.ai-header__avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.14);
  border: 1rpx solid rgba(255, 255, 255, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: inset 0 1rpx 0 rgba(255, 255, 255, 0.3);
}

.ai-header__title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.04em;
}

.ai-header__desc {
  display: block;
  margin-top: 4rpx;
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.02em;
}

.ai-header__history-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 14rpx 22rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.12);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  border-radius: $cv-radius-pill;
  flex-shrink: 0;
  @include cv-pressable;
}
</style>
