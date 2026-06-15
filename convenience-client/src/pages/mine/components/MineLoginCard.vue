<template>
  <view class="mine-login cv-card--elevated">
    <view class="mine-login__icon">
      <u-icon name="account-fill" color="#1d4ed8" size="28" />
    </view>
    <view class="mine-login__text">
      <text class="mine-login__title">登录同城便民</text>
      <text class="mine-login__desc">发布信息、收藏关注、AI 问答</text>
    </view>
    <u-button type="primary" text="去登录" size="small" shape="circle" @click="emit('login')" />
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  login: [];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.mine-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
}

.mine-login__icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 22rpx;
  background: $cv-primary-soft;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mine-login__text {
  flex: 1;
  min-width: 0;
}

.mine-login__title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $cv-text;
  text-align: center;
}

.mine-login__desc {
  display: block;
  margin-top: 6rpx;
  font-size: 24rpx;
  color: $cv-text-muted;
  text-align: center;
}
</style>
