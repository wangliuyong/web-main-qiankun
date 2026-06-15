<template>
  <view class="ai-composer">
    <view class="ai-composer__input-wrap">
      <u-input
        :model-value="question"
        placeholder="输入您的问题"
        border="none"
        :custom-style="inputStyle"
        confirm-type="send"
        @update:model-value="emit('update:question', $event)"
        @confirm="emit('send')"
      />
    </view>
    <view
      class="ai-composer__send"
      :class="{ 'ai-composer__send--disabled': disabled }"
      @click="emit('send')"
    >
      <u-icon name="arrow-up" color="#fff" size="18" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { AI_INPUT_STYLE } from '../composables/useAiChatPage';

defineProps<{
  question: string;
  disabled: boolean;
}>();

const emit = defineEmits<{
  'update:question': [value: string];
  send: [];
}>();

const inputStyle = AI_INPUT_STYLE;
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.ai-composer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx $cv-space-page calc(16rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border-top: 1rpx solid $cv-border;
  box-shadow: 0 -8rpx 32rpx rgba(11, 18, 32, 0.04);
}

.ai-composer__input-wrap {
  flex: 1;
  min-width: 0;
  padding: 18rpx 28rpx;
  background: $cv-surface-muted;
  border-radius: $cv-radius-pill;
  border: 1rpx solid $cv-border;
}

.ai-composer__send {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: linear-gradient(145deg, $cv-primary-dark, $cv-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 12rpx 28rpx rgba(29, 78, 216, 0.28);
  @include cv-pressable;

  &--disabled {
    opacity: 0.45;
    pointer-events: none;
  }
}
</style>
