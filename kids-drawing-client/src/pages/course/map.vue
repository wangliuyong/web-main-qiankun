<template>
  <view class="page-root">
    <view class="safe-top" :style="{ height: statusBarHeight + 'px' }" />
    <view class="nav-bar">
      <view class="nav-back" @click="goBack">
        <text class="nav-back-text">← 返回</text>
      </view>
      <text class="nav-title">课程地图</text>
      <view class="nav-placeholder" />
    </view>

    <scroll-view class="map-scroll" scroll-y>
      <view v-for="chapter in chapters" :key="chapter.id" class="chapter-block">
        <view class="chapter-header" :style="{ backgroundColor: chapter.color }">
          <text class="chapter-header-icon">{{ chapter.icon }}</text>
          <view class="chapter-header-info">
            <text class="chapter-header-title">{{ chapter.title }}</text>
            <text class="chapter-header-desc">{{ chapter.description }}</text>
          </view>
        </view>
        <view
          v-for="(lesson, lIdx) in chapter.lessons"
          :key="lesson.id"
          class="lesson-node"
          :class="getLessonClass(lesson)"
          @click="onLessonClick(lesson)"
        >
          <view class="lesson-dot">
            <text class="lesson-dot-text">{{ lIdx + 1 }}</text>
          </view>
          <view class="lesson-info">
            <text class="lesson-title">{{ lesson.title }}</text>
            <text class="lesson-stars">{{ getStarsText(lesson.id) }}</text>
          </view>
          <text v-if="!isUnlocked(lesson)" class="lock-icon">🔒</text>
          <text v-else-if="isDone(lesson.id)" class="done-icon">✅</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useKidsStore } from '@/stores/kids';
import {
  queryChapters,
  isLessonUnlocked,
  isLessonCompleted,
  queryLessonStars,
} from '@/utils/lesson-loader';
import type { ChapterItem, LessonItem } from '@/types/lesson';

const kidsStore = useKidsStore();
const statusBarHeight = ref(0);
const chapters = ref<ChapterItem[]>(queryChapters());

function isUnlocked(lesson: LessonItem): boolean {
  return isLessonUnlocked(kidsStore.progress, lesson);
}

function isDone(lessonId: string): boolean {
  return isLessonCompleted(kidsStore.progress, lessonId);
}

function getStarsText(lessonId: string): string {
  const stars = queryLessonStars(kidsStore.progress, lessonId);
  if (stars === 0) return '未完成';
  return '⭐'.repeat(stars);
}

function getLessonClass(lesson: LessonItem): string {
  if (!isUnlocked(lesson)) return 'lesson-locked';
  if (isDone(lesson.id)) return 'lesson-done';
  return 'lesson-active';
}

function onLessonClick(lesson: LessonItem): void {
  if (!isUnlocked(lesson)) {
    uni.showToast({ title: '请先完成上一课时', icon: 'none' });
    return;
  }
  uni.navigateTo({ url: `/pages/lesson/detail?lessonId=${lesson.id}` });
}

function goBack(): void {
  uni.navigateBack({});
}

onLoad(() => {
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight || 0;
});
</script>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background-color: #ffd166;
  border-bottom: 3px solid #2d3436;
}

.nav-back { min-width: 60px; }
.nav-back-text { font-size: 16px; color: #2d3436; }
.nav-title { font-size: 18px; font-weight: bold; color: #2d3436; }
.nav-placeholder { min-width: 60px; }

.map-scroll {
  flex: 1;
  height: 0;
  padding: 12px 0;
}

.chapter-block {
  margin-bottom: 16px;
}

.chapter-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  margin: 0 16px;
  border-radius: 16px 16px 0 0;
  border: 3px solid #2d3436;
  border-bottom: none;
}

.chapter-header-icon {
  font-size: 32px;
  margin-right: 12px;
}

.chapter-header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chapter-header-title {
  font-size: 18px;
  font-weight: bold;
  color: #2d3436;
}

.chapter-header-desc {
  font-size: 12px;
  color: #636e72;
  margin-top: 2px;
}

.lesson-node {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 14px 16px;
  margin: 0 16px;
  background-color: #ffffff;
  border-left: 3px solid #2d3436;
  border-right: 3px solid #2d3436;
}

.lesson-node:last-child {
  border-bottom: 3px solid #2d3436;
  border-radius: 0 0 16px 16px;
}

.lesson-locked {
  opacity: 0.5;
  background-color: #f0f0f0;
}

.lesson-done {
  background-color: #fff9e6;
}

.lesson-dot {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: #ffd166;
  border: 2px solid #2d3436;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.lesson-dot-text {
  font-size: 16px;
  font-weight: bold;
  color: #2d3436;
}

.lesson-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.lesson-title {
  font-size: 16px;
  font-weight: bold;
  color: #2d3436;
}

.lesson-stars {
  font-size: 12px;
  color: #636e72;
  margin-top: 2px;
}

.lock-icon, .done-icon {
  font-size: 20px;
}
</style>
