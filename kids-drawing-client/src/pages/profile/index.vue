<template>
  <view class="page-root">
    <view class="page-body">
      <view class="safe-top" :style="{ height: statusBarHeight + 'px' }" />

      <view class="profile-header">
        <text class="avatar">{{ kidsStore.profile.avatarEmoji }}</text>
        <view class="profile-info">
          <text class="nickname">{{ kidsStore.profile.nickname }}</text>
          <text class="profile-sub">小画家成长中</text>
        </view>
      </view>

      <scroll-view class="profile-scroll" scroll-y>
        <view class="page-content profile-inner">
          <view class="stats-row">
            <view class="stat-item">
              <text class="stat-num">{{ kidsStore.totalStars }}</text>
              <text class="stat-label">总星星</text>
            </view>
            <view class="stat-item">
              <text class="stat-num">{{ kidsStore.streakDays }}</text>
              <text class="stat-label">连续天数</text>
            </view>
            <view class="stat-item">
              <text class="stat-num">{{ completedCount }}</text>
              <text class="stat-label">完成课时</text>
            </view>
            <view class="stat-item">
              <text class="stat-num">{{ kidsStore.workCount }}</text>
              <text class="stat-label">作品数</text>
            </view>
          </view>

          <text class="section-title">我的徽章</text>
          <view class="badge-grid">
            <view
              v-for="badge in allBadges"
              :key="badge.id"
              class="badge-item"
              :class="isUnlocked(badge.id) ? 'badge-unlocked' : 'badge-locked'"
            >
              <text class="badge-icon">{{ isUnlocked(badge.id) ? '🏆' : '🔒' }}</text>
              <text class="badge-title">{{ badge.title }}</text>
              <text class="badge-desc">{{ badge.description }}</text>
            </view>
          </view>

          <view class="records-panel">
            <text class="section-title records-title">最近完成</text>
            <view v-if="recentRecords.length > 0" class="records-list">
              <view v-for="record in recentRecords" :key="record.lessonId" class="record-item">
                <text class="record-title">{{ getLessonTitle(record.lessonId) }}</text>
                <text class="record-stars">{{ '⭐'.repeat(record.stars) }}</text>
              </view>
            </view>
            <view v-else class="no-record">
              <text class="no-record-text">还没有完成记录，快去画画吧</text>
            </view>
          </view>

          <view class="nickname-edit" @click="onEditNickname">
            <text class="edit-text">修改昵称</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <KidTabBar :current="3" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import KidTabBar from '@/components/KidTabBar/KidTabBar.vue';
import { useKidsStore } from '@/stores/kids';
import { queryBadges, queryLessonById } from '@/utils/lesson-loader';
import type { BadgeDef } from '@/types/lesson';

const kidsStore = useKidsStore();
const statusBarHeight = ref(0);
const allBadges = ref<BadgeDef[]>(queryBadges());

const completedCount = computed(() => kidsStore.progress.lessonRecords.length);

const recentRecords = computed(() =>
  [...kidsStore.progress.lessonRecords]
    .sort((a, b) => b.completedAt - a.completedAt)
    .slice(0, 5),
);

function isUnlocked(badgeId: string): boolean {
  return kidsStore.progress.unlockedBadges.includes(badgeId);
}

function getLessonTitle(lessonId: string): string {
  return queryLessonById(lessonId)?.title ?? lessonId;
}

function onEditNickname(): void {
  uni.showModal({
    title: '修改昵称',
    editable: true,
    placeholderText: '输入新昵称',
    success: (res) => {
      if (res.confirm && res.content) {
        kidsStore.postUpdateNickname(res.content);
      }
    },
  });
}

onLoad(() => {
  kidsStore.setTabIndex(3);
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight || 0;
});
</script>

<style lang="scss" scoped>
.profile-header {
  @include kd-top-bar;
}

.avatar {
  font-size: 56px;
  margin-right: $kd-space-md;

  @include kd-landscape {
    font-size: 64px;
  }
}

.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: $kd-text-2xl;
  font-weight: bold;
  color: $kd-ink;
}

.profile-sub {
  font-size: $kd-text-sm;
  color: $kd-ink-muted;
  margin-top: 4px;
}

.profile-scroll {
  flex: 1;
  height: 0;
}

.profile-inner {
  padding-bottom: $kd-space-lg;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $kd-space-xs;
  padding: $kd-space-md;
  @include kd-card;
  margin-top: $kd-space-sm;

  @include kd-landscape {
    gap: $kd-space-md;
    padding: $kd-space-lg;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: $kd-text-2xl;
  font-weight: bold;
  color: $kd-accent;

  @include kd-landscape {
    font-size: 32px;
  }
}

.stat-label {
  font-size: $kd-text-xs;
  color: $kd-ink-muted;
  margin-top: 4px;
  text-align: center;
}

.badge-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $kd-space-sm;

  @include kd-landscape {
    grid-template-columns: repeat(4, 1fr);
    gap: $kd-space-md;
  }
}

.badge-item {
  @include kd-card;
  border-width: 2px;
  padding: $kd-space-sm;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.badge-locked {
  opacity: 0.45;
}

.badge-unlocked {
  background-color: $kd-gold-soft;
}

.badge-icon {
  font-size: 32px;
}

.badge-title {
  font-size: $kd-text-sm;
  font-weight: bold;
  color: $kd-ink;
  margin-top: 4px;
  text-align: center;
}

.badge-desc {
  font-size: $kd-text-xs;
  color: $kd-ink-muted;
  margin-top: 2px;
  text-align: center;
}

.records-panel {
  @include kd-landscape {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $kd-space-lg;
    align-items: start;
  }
}

.records-title {
  @include kd-landscape {
    grid-column: 1 / -1;
    margin-bottom: 0;
  }
}

.record-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px $kd-space-md;
  margin: 4px 0;
  background-color: $kd-surface;
  border-radius: $kd-radius-sm;
  border: 1px solid $kd-border-light;
}

.record-title {
  font-size: $kd-text-sm;
  color: $kd-ink;
}

.record-stars {
  font-size: $kd-text-sm;
}

.no-record {
  padding: $kd-space-lg;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-record-text {
  font-size: $kd-text-sm;
  color: $kd-ink-muted;
}

.nickname-edit {
  margin-top: $kd-space-lg;
  padding: $kd-space-sm;
  background-color: $kd-teal;
  border-radius: $kd-radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid $kd-border-color;
  @include kd-touch-target;

  &:active {
    transform: scale(0.98);
  }
}

.edit-text {
  font-size: $kd-text-base;
  font-weight: bold;
  color: $kd-ink;
}
</style>
