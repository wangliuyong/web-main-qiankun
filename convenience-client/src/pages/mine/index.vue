<template>
  <view class="page-mine cv-page" :style="pageStyle">
    <MineHeader
      :avatar="userStore.profile?.avatar"
      :nickname="userStore.nickname"
      :is-logged-in="userStore.isLoggedIn"
      :masked-phone="maskedPhone"
      :join-label="joinLabel"
      @click="onHeaderClick"
    />

    <view class="page-mine__body">
      <MineBodySkeleton v-if="loading && userStore.isLoggedIn" />

      <template v-else>
        <MineLoginCard v-if="!userStore.isLoggedIn" @login="goLogin" />

        <MineStatsCard
          :collect-text="statText(overview.collectCount)"
          :publish-text="statText(overview.publishCount)"
          :ai-session-text="statText(overview.aiSessionCount)"
          :pending-count="overview.pendingCount"
          @collect="goPage('/pages/mine/collect')"
          @publish="openPublishPage()"
          @ai-history="goPage('/pages/ai/history')"
        />

        <MineQuickActionsGrid :actions="quickActions" />

        <MineRecentSection
          v-if="userStore.isLoggedIn && hasRecent"
          :collects="recentCollects"
          :posts="recentPosts"
          @detail="goDetail"
        />

        <MineAboutCard :version="appVersion" />

        <MineLogoutButton v-if="userStore.isLoggedIn" @logout="onLogout" />
      </template>
    </view>

    <AppTabBar page-path="pages/mine/index" />
  </view>
</template>

<script setup lang="ts">
import AppTabBar from '@/components/AppTabBar/AppTabBar.vue';
import { useTabBarPage } from '@/composables/useTabBarPage';
import { useSafeAreaInsets } from '@/composables/useSafeAreaInsets';
import MineAboutCard from './components/MineAboutCard.vue';
import MineBodySkeleton from './components/MineBodySkeleton.vue';
import MineHeader from './components/MineHeader.vue';
import MineLoginCard from './components/MineLoginCard.vue';
import MineLogoutButton from './components/MineLogoutButton.vue';
import MineQuickActionsGrid from './components/MineQuickActionsGrid.vue';
import MineRecentSection from './components/MineRecentSection.vue';
import MineStatsCard from './components/MineStatsCard.vue';
import { useMinePage } from './composables/useMinePage';

useTabBarPage();
const { pageStyle } = useSafeAreaInsets();

const {
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
} = useMinePage();
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.page-mine__body {
  @include cv-body-sheet;
  margin-top: -36rpx;
}
</style>
