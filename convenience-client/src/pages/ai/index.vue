<template>
  <view class="page-ai" :style="pageStyle">
    <AiChatHeader @back="goBack" @history="goHistory" />

    <AiMessagePanel
      :messages="messages"
      :streaming="streaming"
      :streaming-msg-id="streamingMsgId"
      :history-loading="historyLoading"
      :scroll-top="scrollTop"
      :chips="AI_QUICK_CHIPS"
      @chip="useChip"
    />

    <AiComposerBar
      v-model:question="question"
      :disabled="streaming || !question.trim()"
      @send="onSend"
    />
  </view>
</template>

<script setup lang="ts">
import { useTabBarPage } from '@/composables/useTabBarPage';
import { useSafeAreaInsets } from '@/composables/useSafeAreaInsets';
import AiChatHeader from './components/AiChatHeader.vue';
import AiComposerBar from './components/AiComposerBar.vue';
import AiMessagePanel from './components/AiMessagePanel.vue';
import { AI_QUICK_CHIPS, useAiChatPage } from './composables/useAiChatPage';

useTabBarPage();
const { pageStyle } = useSafeAreaInsets();

const {
  question,
  messages,
  streaming,
  streamingMsgId,
  historyLoading,
  scrollTop,
  goHistory,
  goBack,
  useChip,
  onSend,
} = useAiChatPage();
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.page-ai {
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  @include cv-page-ambient;
  overflow: hidden;
}
</style>
