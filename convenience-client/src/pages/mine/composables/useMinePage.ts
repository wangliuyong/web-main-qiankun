import { ref, computed, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { postLogout } from '@/api/auth.api';
import { queryCollectList } from '@/api/collect.api';
import { queryMyCityInfoList } from '@/api/city-info.api';
import { queryMineOverview } from '@/api/mine.api';
import type { MineOverview } from '@/api/mine.api';
import { AI_PAGE_PATH, isTabBarPath, openPublishPage } from '@/constants/tabbar';
import { useUserStore } from '@/stores/user';
import type { CityInfoItem } from '@/types/city-info';
import { formatDateTime, formatPhoneMask } from '@/utils/format';

/** 快捷入口配置项 */
export interface MineQuickAction {
  key: string;
  title: string;
  desc: string;
  icon: string;
  tone: 'blue' | 'ink' | 'teal' | 'slate';
  onTap: () => void;
}

/**
 * 我的页面：概览数据、最近动态与导航
 */
export function useMinePage() {
  const userStore = useUserStore();
  const appVersion = 'v1.0.0';
  const loading = ref(true);

  const overview = ref<MineOverview>({
    collectCount: 0,
    publishCount: 0,
    pendingCount: 0,
    aiSessionCount: 0,
  });

  const recentCollects = ref<CityInfoItem[]>([]);
  const recentPosts = ref<CityInfoItem[]>([]);

  const maskedPhone = computed(() => formatPhoneMask(userStore.profile?.phone));

  const joinLabel = computed(() => {
    const createdAt = userStore.profile?.createdAt;
    if (!createdAt) return '';
    return `${formatDateTime(createdAt, 'YYYY年M月')}加入`;
  });

  const hasRecent = computed(
    () => recentCollects.value.length > 0 || recentPosts.value.length > 0,
  );

  const quickActions = computed((): MineQuickAction[] => [
    {
      key: 'collect',
      title: '我的收藏',
      desc: '浏览关注的信息',
      icon: 'star-fill',
      tone: 'blue',
      onTap: () => goPage('/pages/mine/collect'),
    },
    {
      key: 'publish',
      title: '发布信息',
      desc: overview.value.pendingCount
        ? `${overview.value.pendingCount} 条待审核`
        : '填写同城便民信息',
      icon: 'plus-circle-fill',
      tone: 'ink',
      onTap: () => openPublishPage(),
    },
    {
      key: 'ai',
      title: 'AI 助手',
      desc: '办事指南',
      icon: 'chat-fill',
      tone: 'teal',
      onTap: () => uni.switchTab({ url: `/${AI_PAGE_PATH}` }),
    },
    {
      key: 'profile',
      title: '账号设置',
      desc: '昵称、头像与手机号',
      icon: 'setting-fill',
      tone: 'slate',
      onTap: () => goPage('/pages/mine/profile'),
    },
  ]);

  function statText(value: number): string {
    if (!userStore.isLoggedIn) return '-';
    return String(value);
  }

  function goLogin() {
    uni.navigateTo({ url: '/pages/auth/login' });
  }

  function onHeaderClick() {
    if (userStore.isLoggedIn) {
      uni.navigateTo({ url: '/pages/mine/profile' });
    } else {
      goLogin();
    }
  }

  function goPage(url: string) {
    if (isTabBarPath(url)) {
      uni.switchTab({ url: url.startsWith('/') ? url : `/${url}` });
      return;
    }
    if (!userStore.isLoggedIn && !url.includes('/pages/mine/profile')) {
      goLogin();
      return;
    }
    uni.navigateTo({ url });
  }

  function goDetail(item: CityInfoItem) {
    uni.navigateTo({ url: `/pages/info/detail?id=${item.id}` });
  }

  async function loadMineData() {
    if (!userStore.isLoggedIn) {
      overview.value = {
        collectCount: 0,
        publishCount: 0,
        pendingCount: 0,
        aiSessionCount: 0,
      };
      recentCollects.value = [];
      recentPosts.value = [];
      loading.value = false;
      return;
    }

    loading.value = true;
    try {
      const [stats, collectRes, postRes] = await Promise.all([
        queryMineOverview(),
        queryCollectList(1, 2),
        queryMyCityInfoList(1, 2),
      ]);
      overview.value = stats;
      recentCollects.value = collectRes.list
        .map((c) => c.info)
        .filter(Boolean) as CityInfoItem[];
      recentPosts.value = postRes.list;
    } finally {
      loading.value = false;
    }
  }

  async function onLogout() {
    await postLogout();
    userStore.logout();
    await loadMineData();
    uni.showToast({ title: '已退出', icon: 'success' });
  }

  onMounted(loadMineData);
  onShow(loadMineData);

  return {
    userStore,
    appVersion,
    loading,
    overview,
    recentCollects,
    recentPosts,
    maskedPhone,
    joinLabel,
    hasRecent,
    quickActions,
    statText,
    goLogin,
    onHeaderClick,
    goPage,
    goDetail,
    onLogout,
    openPublishPage,
  };
}
