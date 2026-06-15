<template>
  <view class="mine-about cv-card">
    <text class="mine-about__title">同城便民</text>
    <text class="mine-about__ver">{{ version }}</text>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  version: string;
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.mine-about {
  margin-top: 24rpx;
  padding: 28rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mine-about__title {
  font-size: 28rpx;
  font-weight: 600;
  color: $cv-text;
}

.mine-about__ver {
  font-size: 24rpx;
  color: $cv-text-muted;
}
</style>
