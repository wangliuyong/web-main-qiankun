<template>
  <view class="mine-header">
    <view class="mine-header__glow mine-header__glow--1" />
    <view class="mine-header__glow mine-header__glow--2" />
    <view class="mine-header__inner" @click="emit('click')">
      <view class="mine-header__avatar-wrap">
        <u-avatar :src="avatar" size="72" />
        <view v-if="isLoggedIn" class="mine-header__status-dot" />
      </view>
      <view class="mine-header__info">
        <text class="mine-header__name">{{ nickname }}</text>
        <text v-if="isLoggedIn" class="mine-header__meta">
          {{ maskedPhone || '未绑定手机' }}
          <text v-if="joinLabel" class="mine-header__meta-sep">|</text>
          {{ joinLabel }}
        </text>
        <text v-else class="mine-header__meta">登录后同步收藏与发布记录</text>
      </view>
      <view class="mine-header__arrow">
        <u-icon name="arrow-right" color="#fff" size="16" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  avatar?: string;
  nickname: string;
  isLoggedIn: boolean;
  maskedPhone: string;
  joinLabel: string;
}>();

const emit = defineEmits<{
  click: [];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.mine-header {
  position: relative;
  overflow: hidden;
  padding: 48rpx $cv-space-page 56rpx;
  @include cv-safe-area-top(36rpx);
  @include cv-hero-bg;
}

.mine-header__glow {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1rpx solid rgba(255, 255, 255, 0.12);
  pointer-events: none;
}

.mine-header__glow--1 {
  width: 280rpx;
  height: 280rpx;
  right: -60rpx;
  top: -40rpx;
}

.mine-header__glow--2 {
  width: 140rpx;
  height: 140rpx;
  left: -30rpx;
  bottom: 0;
}

.mine-header__inner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 24rpx;
  z-index: 1;
  @include cv-pressable;
}

.mine-header__avatar-wrap {
  position: relative;
  padding: 4rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.18);
}

.mine-header__status-dot {
  position: absolute;
  right: 6rpx;
  bottom: 6rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #22c55e;
  border: 2rpx solid #fff;
}

.mine-header__info {
  flex: 1;
  min-width: 0;
}

.mine-header__name {
  display: block;
  font-size: 42rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.05em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mine-header__meta {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.45;
}

.mine-header__meta-sep {
  margin: 0 10rpx;
  opacity: 0.5;
}

.mine-header__arrow {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
