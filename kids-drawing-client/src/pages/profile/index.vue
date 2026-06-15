<template>
  <view class="page-root">
    <view class="safe-top" :style="{ height: statusBarHeight + 'px' }" />

    <view class="profile-card">
      <text class="avatar">{{ kidsStore.profile.avatarEmoji }}</text>
      <view class="profile-info">
        <text class="nickname">{{ kidsStore.profile.nickname }}</text>
        <text class="profile-sub">小画家成长中 🌱</text>
      </view>
    </view>

    <scroll-view class="profile-scroll" scroll-y>
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

      <text class="section-title">我的徽章 🏅</text>
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

      <text class="section-title">最近完成</text>
      <view v-if="recentRecords.length > 0">
        <view v-for="record in recentRecords" :key="record.lessonId" class="record-item">
          <text class="record-title">{{ getLessonTitle(record.lessonId) }}</text>
          <text class="record-stars">{{ '⭐'.repeat(record.stars) }}</text>
        </view>
      </view>
      <view v-else class="no-record">
        <text class="no-record-text">还没有完成记录，快去画画吧！</text>
      </view>

      <view class="nickname-edit" @click="onEditNickname">
        <text class="edit-text">✏️ 修改昵称</text>
      </view>
    </scroll-view>

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

/** 最近 5 条完成记录（按时间倒序） */
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
.profile-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px 16px;
  background-color: #ffd166;
  border-bottom: 3px solid #2d3436;
}

.avatar {
  font-size: 56px;
  margin-right: 16px;
}

.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: 24px;
  font-weight: bold;
  color: #2d3436;
}

.profile-sub {
  font-size: 14px;
  color: #636e72;
  margin-top: 4px;
}

.profile-scroll {
  flex: 1;
  height: 0;
}

.stats-row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 16px;
  background-color: #ffffff;
  margin: 12px 16px;
  border-radius: 16px;
  border: 3px solid #2d3436;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num {
  font-size: 24px;
  font-weight: bold;
  color: #ff6b6b;
}

.stat-label {
  font-size: 12px;
  color: #636e72;
  margin-top: 4px;
}

.badge-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 12px;
  justify-content: space-between;
}

.badge-item {
  width: 46%;
  background-color: #ffffff;
  border-radius: 12px;
  border: 2px solid #2d3436;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.badge-locked { opacity: 0.4; }
.badge-unlocked { background-color: #fff9e6; }

.badge-icon { font-size: 32px; }
.badge-title {
  font-size: 14px;
  font-weight: bold;
  color: #2d3436;
  margin-top: 4px;
}
.badge-desc {
  font-size: 11px;
  color: #636e72;
  margin-top: 2px;
  text-align: center;
}

.record-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  margin: 4px 16px;
  background-color: #ffffff;
  border-radius: 10px;
  border: 1px solid #dfe6e9;
}

.record-title { font-size: 14px; color: #2d3436; }
.record-stars { font-size: 14px; }

.no-record {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-record-text { font-size: 14px; color: #636e72; }

.nickname-edit {
  margin: 20px 16px;
  padding: 12px;
  background-color: #4ecdc4;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #2d3436;
}

.edit-text {
  font-size: 16px;
  font-weight: bold;
  color: #2d3436;
}
</style>
