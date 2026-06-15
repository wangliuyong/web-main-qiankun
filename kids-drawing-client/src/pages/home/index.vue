<template>
  <view class="page-root">
    <view class="safe-top" :style="{ height: statusBarHeight + 'px' }" />
    <view class="home-header">
      <text class="mascot">🎨</text>
      <view class="header-text">
        <text class="greeting">你好，{{ kidsStore.profile.nickname }}！</text>
        <text class="subtitle">今天也来画画吧～</text>
      </view>
      <view class="star-badge">
        <text class="star-count">⭐ {{ kidsStore.totalStars }}</text>
      </view>
    </view>

    <scroll-view class="home-scroll" scroll-y>
      <view class="card continue-card" @click="onContinue">
        <text class="card-label">继续学习</text>
        <text class="card-title">{{ continueTitle }}</text>
        <text class="card-desc">{{ continueDesc }}</text>
        <view class="btn-primary" style="margin-top: 12px">
          <text class="btn-primary-text">开始画画 →</text>
        </view>
      </view>

      <view class="card challenge-card" @click="goStudio">
        <text class="card-label">每日挑战 🌟</text>
        <text class="card-desc">连续学习 {{ kidsStore.streakDays }} 天，加油！</text>
      </view>

      <text class="section-title">探索</text>
      <view class="quick-grid">
        <view class="quick-item" @click="goCourseMap">
          <text class="quick-icon">🗺️</text>
          <text class="quick-label">课程地图</text>
        </view>
        <view class="quick-item" @click="goStudio">
          <text class="quick-icon">🖌️</text>
          <text class="quick-label">自由画板</text>
        </view>
        <view class="quick-item" @click="goGallery">
          <text class="quick-icon">🖼️</text>
          <text class="quick-label">我的作品</text>
        </view>
        <view class="quick-item" @click="goProfile">
          <text class="quick-icon">🏆</text>
          <text class="quick-label">成长档案</text>
        </view>
      </view>

      <text class="section-title">学习路线</text>
      <view
        v-for="chapter in chapters"
        :key="chapter.id"
        class="chapter-preview"
        @click="goCourseMap"
      >
        <text class="chapter-icon">{{ chapter.icon }}</text>
        <view class="chapter-info">
          <text class="chapter-name">{{ chapter.title }}</text>
          <text class="chapter-progress">{{ getChapterProgress(chapter) }}</text>
        </view>
        <text class="chapter-arrow">›</text>
      </view>
    </scroll-view>

    <KidTabBar :current="0" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import KidTabBar from '@/components/KidTabBar/KidTabBar.vue';
import { useKidsStore } from '@/stores/kids';
import { queryChapters, queryContinueLesson, queryChapterCompletedCount } from '@/utils/lesson-loader';
import type { ChapterItem } from '@/types/lesson';

const kidsStore = useKidsStore();
const statusBarHeight = ref(0);
const chapters = ref<ChapterItem[]>(queryChapters());

const continueLesson = computed(() => queryContinueLesson(kidsStore.progress));

const continueTitle = computed(() => {
  const lesson = continueLesson.value;
  return lesson ? lesson.title : '开始你的绘画之旅';
});

const continueDesc = computed(() => {
  const lesson = continueLesson.value;
  return lesson ? lesson.description : '从线条认知开始吧';
});

function getChapterProgress(chapter: ChapterItem): string {
  const done = queryChapterCompletedCount(kidsStore.progress, chapter);
  return `${done} / ${chapter.lessons.length} 课时`;
}

function onContinue(): void {
  const lesson = continueLesson.value;
  if (!lesson) {
    goCourseMap();
    return;
  }
  uni.navigateTo({ url: `/pages/lesson/detail?lessonId=${lesson.id}` });
}

function goCourseMap(): void {
  uni.navigateTo({ url: '/pages/course/map' });
}

function goStudio(): void {
  uni.redirectTo({ url: '/pages/studio/index' });
}

function goGallery(): void {
  uni.redirectTo({ url: '/pages/gallery/index' });
}

function goProfile(): void {
  uni.redirectTo({ url: '/pages/profile/index' });
}

onLoad(() => {
  kidsStore.setTabIndex(0);
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight || 0;
});
</script>

<style lang="scss" scoped>
.home-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background-color: #ffd166;
  border-bottom: 3px solid #2d3436;
}

.mascot {
  font-size: 48px;
  margin-right: 12px;
}

.header-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.greeting {
  font-size: 20px;
  font-weight: bold;
  color: #2d3436;
}

.subtitle {
  font-size: 14px;
  color: #636e72;
  margin-top: 2px;
}

.star-badge {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 6px 12px;
  border: 2px solid #2d3436;
}

.star-count {
  font-size: 16px;
  font-weight: bold;
  color: #2d3436;
}

.home-scroll {
  flex: 1;
  height: 0;
}

.continue-card {
  background-color: #4ecdc4;
}

.challenge-card {
  background-color: #fff0f0;
}

.card-label {
  font-size: 14px;
  color: #636e72;
  margin-bottom: 4px;
  display: block;
}

.card-title {
  font-size: 22px;
  font-weight: bold;
  color: #2d3436;
  display: block;
}

.card-desc {
  font-size: 14px;
  color: #636e72;
  margin-top: 4px;
  display: block;
}

.quick-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 12px;
  justify-content: space-between;
}

.quick-item {
  width: 46%;
  background-color: #ffffff;
  border-radius: 16px;
  border: 3px solid #2d3436;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 12px;
  box-sizing: border-box;
}

.quick-icon {
  font-size: 32px;
}

.quick-label {
  font-size: 14px;
  font-weight: bold;
  color: #2d3436;
  margin-top: 6px;
}

.chapter-preview {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  border-radius: 12px;
  border: 2px solid #2d3436;
  padding: 12px 16px;
  margin: 6px 16px;
}

.chapter-icon {
  font-size: 28px;
  margin-right: 12px;
}

.chapter-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chapter-name {
  font-size: 16px;
  font-weight: bold;
  color: #2d3436;
}

.chapter-progress {
  font-size: 12px;
  color: #636e72;
  margin-top: 2px;
}

.chapter-arrow {
  font-size: 24px;
  color: #636e72;
}
</style>
