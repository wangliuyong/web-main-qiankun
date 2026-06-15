<template>
  <view class="mine-stats cv-card--elevated">
    <view class="mine-stats__item" @click="emit('collect')">
      <text class="mine-stats__value">{{ collectText }}</text>
      <text class="mine-stats__label">收藏</text>
    </view>
    <view class="mine-stats__divider" />
    <view class="mine-stats__item" @click="emit('publish')">
      <view class="mine-stats__value-row">
        <text class="mine-stats__value">{{ publishText }}</text>
        <text v-if="pendingCount > 0" class="mine-stats__badge">{{ pendingCount }}待审</text>
      </view>
      <text class="mine-stats__label">发布</text>
    </view>
    <view class="mine-stats__divider" />
    <view class="mine-stats__item" @click="emit('aiHistory')">
      <text class="mine-stats__value">{{ aiSessionText }}</text>
      <text class="mine-stats__label">AI 会话</text>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  collectText: string;
  publishText: string;
  aiSessionText: string;
  pendingCount: number;
}>();

const emit = defineEmits<{
  collect: [];
  publish: [];
  aiHistory: [];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.mine-stats {
  display: flex;
  align-items: stretch;
  padding: 32rpx 12rpx 28rpx;
}

.mine-stats__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  @include cv-pressable;
}

.mine-stats__value-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.mine-stats__value {
  font-size: 40rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.mine-stats__badge {
  padding: 4rpx 12rpx;
  border-radius: $cv-radius-pill;
  font-size: 18rpx;
  font-weight: 600;
  color: $cv-accent;
  background: $cv-accent-soft;
}

.mine-stats__label {
  font-size: 24rpx;
  color: $cv-text-muted;
}

.mine-stats__divider {
  width: 1rpx;
  background: $cv-border-strong;
  margin: 8rpx 0;
}
</style>
