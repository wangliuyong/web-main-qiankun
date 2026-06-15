<template>
  <scroll-view
    class="ai-messages"
    scroll-y
    :scroll-top="scrollTop"
    scroll-with-animation
    :show-scrollbar="false"
  >
    <view v-if="historyLoading" class="ai-messages__sk">
      <view
        v-for="i in 3"
        :key="i"
        class="ai-messages__sk-row"
        :class="{ 'ai-messages__sk-row--right': i % 2 === 0 }"
      >
        <SkeletonBlock
          :width="i % 2 === 0 ? '60%' : '72%'"
          :height="i === 2 ? '160rpx' : '80rpx'"
          radius="24rpx"
          :shimmer="true"
        />
      </view>
    </view>

    <AiWelcomePanel
      v-else-if="!messages.length && !streaming"
      :chips="chips"
      @chip="emit('chip', $event)"
    />

    <view v-if="!historyLoading" class="ai-messages__list">
      <AiMessageBubble
        v-for="msg in messages"
        :key="msg.id"
        :role="msg.role"
        :content="msg.content"
        :streaming="streaming && msg.role === 'assistant' && msg.id === streamingMsgId"
      />
    </view>

    <view class="ai-messages__pad" />
  </scroll-view>
</template>

<script setup lang="ts">
import AiMessageBubble from '@/components/AiMessageBubble/AiMessageBubble.vue';
import SkeletonBlock from '@/components/SkeletonBlock/SkeletonBlock.vue';
import type { AiMessageItem } from '@/types/city-info';
import AiWelcomePanel from './AiWelcomePanel.vue';

defineProps<{
  messages: AiMessageItem[];
  streaming: boolean;
  streamingMsgId?: number;
  historyLoading: boolean;
  scrollTop: number;
  chips: string[];
}>();

const emit = defineEmits<{
  chip: [text: string];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

$ai-composer-offset: calc(112rpx + env(safe-area-inset-bottom));

.ai-messages {
  @include cv-chat-scroll;
  padding: 0 24rpx;
  padding-bottom: $ai-composer-offset;
}

.ai-messages__list {
  padding-top: 24rpx;
}

.ai-messages__pad {
  height: 16rpx;
}

.ai-messages__sk {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 24rpx 0;
}

.ai-messages__sk-row {
  display: flex;
  justify-content: flex-start;

  &--right {
    justify-content: flex-end;
  }
}
</style>
