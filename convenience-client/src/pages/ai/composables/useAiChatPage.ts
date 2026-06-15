import { ref, nextTick, onMounted } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { queryAiMessages, streamAiChat } from '@/api/ai.api';
import { isTabBarPath } from '@/constants/tabbar';
import { useTabBarStore } from '@/stores/tabbar';
import { useAiStore } from '@/stores/ai';
import { useUserStore } from '@/stores/user';
import type { AiMessageItem, CityInfoItem } from '@/types/city-info';
import { resolveAiMessageCards } from '@/utils/ai-message-cards';

/** u-input 内联样式，避免与外层 flex 冲突 */
export const AI_INPUT_STYLE = {
  background: 'transparent',
  fontSize: '28rpx',
  padding: '0',
};

export const AI_QUICK_CHIPS = ['帮我找二手物品', '附近有什么招聘', '如何发布信息？'];

/**
 * AI 聊天页：会话历史、流式回复与导航
 */
export function useAiChatPage() {
  const aiStore = useAiStore();
  const userStore = useUserStore();

  const question = ref('');
  const messages = ref<AiMessageItem[]>([]);
  const sessionId = ref<number>();
  const streaming = ref(false);
  const streamingMsgId = ref<number>();
  const historyLoading = ref(false);
  const scrollTop = ref(0);
  let msgId = 1;

  function goHistory() {
    if (!userStore.isLoggedIn) {
      uni.navigateTo({ url: '/pages/auth/login' });
      return;
    }
    uni.navigateTo({ url: '/pages/ai/history' });
  }

  function normalizeRoute(route?: string) {
    return (route ?? '').replace(/^\//, '').split('?')[0];
  }

  /** Tab 页之间 navigateBack 常只会刷新当前页，因此默认 switchTab */
  function leaveToHomeTab() {
    const tabBarStore = useTabBarStore();
    tabBarStore.activeIndex = 0;
    tabBarStore.tabBarHidden = false;
    uni.switchTab({
      url: '/pages/home/index',
      fail: () => {
        uni.reLaunch({ url: '/pages/home/index' });
      },
    });
  }

  /** 仅当上一页是次级页（如历史会话）时才 navigateBack */
  function goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      const prevRoute = normalizeRoute(pages[pages.length - 2]?.route);
      if (prevRoute && !isTabBarPath(`/${prevRoute}`)) {
        uni.navigateBack({
          fail: () => leaveToHomeTab(),
        });
        return;
      }
    }
    leaveToHomeTab();
  }

  function useChip(text: string) {
    question.value = text;
    onSend();
  }

  function goInfoDetail(item: CityInfoItem) {
    uni.navigateTo({ url: `/pages/info/detail?id=${item.id}` });
  }

  /** 规范化历史/API 消息：剥离内嵌卡片标记 */
  function normalizeMessage(msg: AiMessageItem): AiMessageItem {
    if (msg.role !== 'assistant') return msg;
    const { text, relatedInfos } = resolveAiMessageCards(msg.content, msg.relatedInfos);
    return { ...msg, content: text, relatedInfos };
  }

  async function scrollToBottom() {
    await nextTick();
    scrollTop.value = scrollTop.value === 99999 ? 100000 : 99999;
  }

  async function onSend() {
    const text = question.value.trim();
    if (!text || streaming.value) return;

    if (!userStore.isLoggedIn) {
      uni.navigateTo({ url: '/pages/auth/login' });
      return;
    }

    question.value = '';
    const userMsg: AiMessageItem = {
      id: msgId++,
      sessionId: sessionId.value || 0,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    messages.value.push(userMsg);
    await scrollToBottom();

    const assistantMsg: AiMessageItem = {
      id: msgId++,
      sessionId: sessionId.value || 0,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
    };
    messages.value.push(assistantMsg);
    streaming.value = true;
    streamingMsgId.value = assistantMsg.id;

    try {
      const gen = streamAiChat({ sessionId: sessionId.value, question: text });
      let step = await gen.next();
      while (!step.done) {
        assistantMsg.content += step.value;
        await scrollToBottom();
        step = await gen.next();
      }
      if (step.value?.sessionId) {
        sessionId.value = step.value.sessionId;
      }
      if (step.value?.relatedInfos?.length) {
        assistantMsg.relatedInfos = step.value.relatedInfos;
      }
    } catch (e) {
      assistantMsg.content = (e as Error).message || '回答失败，请重试';
    } finally {
      streaming.value = false;
      streamingMsgId.value = undefined;
      await scrollToBottom();
    }
  }

  async function loadSessionHistory(id: number) {
    sessionId.value = id;
    streaming.value = false;
    question.value = '';
    historyLoading.value = true;
    try {
      const history = await queryAiMessages(id);
      messages.value = history.map(normalizeMessage);
      msgId = history.length + 1;
      await scrollToBottom();
    } finally {
      historyLoading.value = false;
    }
  }

  onLoad((query) => {
    if (query?.sessionId) {
      sessionId.value = Number(query.sessionId);
    }
  });

  onShow(async () => {
    const pendingId = aiStore.consumePendingSessionId();
    if (pendingId) {
      await loadSessionHistory(pendingId);
    }
  });

  onMounted(async () => {
    if (!sessionId.value || messages.value.length) return;
    await loadSessionHistory(sessionId.value);
  });

  return {
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
    goInfoDetail,
  };
}
