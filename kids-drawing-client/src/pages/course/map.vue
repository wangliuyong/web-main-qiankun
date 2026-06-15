<template>
  <view class="page-root page-sub">
    <view class="page-body">
      <view class="safe-top" :style="{ height: statusBarHeight + 'px' }" />
      <view class="kd-nav-bar">
        <view class="kd-nav-back" @click="goBack">
          <text class="kd-nav-back-text">← 返回</text>
        </view>
        <text class="kd-nav-title">🗺️ 课程地图</text>
        <view class="kd-nav-placeholder" />
      </view>

      <scroll-view class="map-scroll" scroll-y>
        <view class="page-content map-inner">
          <view
            v-for="chapter in chapters"
            :key="chapter.id"
            class="chapter-block"
          >
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
              <text v-if="!isUnlocked(lesson)" class="status-icon">🔒</text>
              <text v-else-if="isDone(lesson.id)" class="status-icon">✅</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
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
.map-scroll {
  flex: 1;
  height: 0;
}

.map-inner {
  padding-top: $kd-space-sm;
  padding-bottom: $kd-space-xl;

  @include kd-landscape {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $kd-space-lg;
    align-items: start;
  }
}

.chapter-block {
  margin-bottom: $kd-space-md;

  @include kd-landscape {
    margin-bottom: 0;
  }
}

.chapter-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: $kd-space-sm $kd-space-md;
  border-radius: $kd-radius-md $kd-radius-md 0 0;
  border: $kd-border-width solid $kd-border-color;
  border-bottom: none;
}

.chapter-header-icon {
  font-size: 32px;
  margin-right: $kd-space-sm;
}

.chapter-header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chapter-header-title {
  font-size: $kd-text-lg;
  font-weight: bold;
  color: $kd-ink;
}

.chapter-header-desc {
  font-size: $kd-text-xs;
  color: $kd-ink-muted;
  margin-top: 2px;
}

.lesson-node {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 14px $kd-space-md;
  background-color: $kd-surface;
  border-left: $kd-border-width solid $kd-border-color;
  border-right: $kd-border-width solid $kd-border-color;
  @include kd-touch-target;

  &:active {
    opacity: 0.9;
  }

  &:last-child {
    border-bottom: $kd-border-width solid $kd-border-color;
    border-radius: 0 0 $kd-radius-md $kd-radius-md;
  }
}

.lesson-locked {
  opacity: 0.55;
  background-color: $kd-border-light;
}

.lesson-done {
  background-color: $kd-gold-soft;
}

.lesson-dot {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: linear-gradient(135deg, $kd-yellow 0%, $kd-peach 100%);
  border: 2px solid $kd-border-color;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: $kd-space-sm;
}

.lesson-dot-text {
  font-size: $kd-text-base;
  font-weight: bold;
  color: $kd-ink;
}

.lesson-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.lesson-title {
  font-size: $kd-text-base;
  font-weight: bold;
  color: $kd-ink;
}

.lesson-stars {
  font-size: $kd-text-xs;
  color: $kd-ink-muted;
  margin-top: 2px;
}

.status-icon {
  font-size: 20px;
}
</style>
