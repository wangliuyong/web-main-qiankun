<template>
  <view class="ai-welcome">
    <view class="ai-welcome__icon">
      <u-icon name="chat" color="#1d4ed8" size="36" />
    </view>
    <text class="ai-welcome__title">有什么可以帮你？</text>
    <text class="ai-welcome__sub">选择快捷问题，或直接输入</text>
    <view class="ai-welcome__chips">
      <view v-for="chip in chips" :key="chip" class="ai-welcome__chip" @click="emit('chip', chip)">
        <text>{{ chip }}</text>
        <u-icon name="arrow-right" color="#1d4ed8" size="12" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  chips: string[];
}>();

const emit = defineEmits<{
  chip: [text: string];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.ai-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 20rpx 40rpx;
  text-align: center;
}

.ai-welcome__icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 36rpx;
  background: $cv-surface;
  border: 1rpx solid $cv-border;
  box-shadow: $cv-shadow-soft;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
}

.ai-welcome__title {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.05em;
}

.ai-welcome__sub {
  display: block;
  margin-top: 12rpx;
  font-size: 26rpx;
  color: $cv-text-secondary;
}

.ai-welcome__chips {
  width: 100%;
  margin-top: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.ai-welcome__chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  background: $cv-surface;
  border: 1rpx solid $cv-border;
  border-radius: $cv-radius-card;
  box-shadow: $cv-shadow-soft;
  font-size: 28rpx;
  color: $cv-text;
  font-weight: 500;
  @include cv-pressable;
}
</style>
