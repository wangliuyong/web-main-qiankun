<template>
  <view class="page-root">
    <view class="safe-top" :style="{ height: statusBarHeight + 'px' }" />
    <view class="nav-bar">
      <view class="nav-back" @click="goBack">
        <text class="nav-back-text">← 返回</text>
      </view>
      <text class="nav-title">课时详情</text>
      <view class="nav-placeholder" />
    </view>

    <scroll-view v-if="lesson" class="detail-scroll" scroll-y>
      <view class="card">
        <text class="lesson-title">{{ lesson.title }}</text>
        <text class="lesson-desc">{{ lesson.description }}</text>
        <view class="difficulty-row">
          <text class="difficulty-label">难度：</text>
          <text v-for="i in lesson.difficulty" :key="i" class="diff-star">⭐</text>
        </view>
      </view>

      <text class="section-title">学习步骤</text>
      <view v-for="step in lesson.steps" :key="step.order" class="step-preview">
        <text class="step-num">{{ step.order }}</text>
        <text class="step-hint">{{ step.hint }}</text>
        <text v-if="step.required" class="step-required">必做</text>
      </view>

      <view class="start-btn" @click="onStart">
        <text class="start-btn-text">开始画画 🖌️</text>
      </view>
    </scroll-view>

    <view v-else class="empty-wrap">
      <text class="empty-text">课时不存在</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { queryLessonById } from '@/utils/lesson-loader';
import type { LessonItem } from '@/types/lesson';

const statusBarHeight = ref(0);
const lesson = ref<LessonItem | null>(null);
const lessonId = ref('');

function onStart(): void {
  if (!lessonId.value) return;
  uni.navigateTo({ url: `/pages/studio/index?lessonId=${lessonId.value}` });
}

function goBack(): void {
  uni.navigateBack({});
}

onLoad((options) => {
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight || 0;
  const id = options?.lessonId as string | undefined;
  if (id) {
    lessonId.value = id;
    lesson.value = queryLessonById(id);
  }
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

.detail-scroll { flex: 1; height: 0; }

.lesson-title {
  font-size: 24px;
  font-weight: bold;
  color: #2d3436;
  display: block;
}

.lesson-desc {
  font-size: 14px;
  color: #636e72;
  margin-top: 8px;
  display: block;
}

.difficulty-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
}

.difficulty-label {
  font-size: 14px;
  color: #636e72;
}

.diff-star { font-size: 16px; }

.step-preview {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  border-radius: 12px;
  border: 2px solid #2d3436;
  padding: 12px 16px;
  margin: 6px 16px;
}

.step-num {
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: #4ecdc4;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: #2d3436;
  margin-right: 12px;
  line-height: 28px;
}

.step-hint {
  flex: 1;
  font-size: 15px;
  color: #2d3436;
}

.step-required {
  font-size: 11px;
  color: #ff6b6b;
  background-color: #fff0f0;
  padding: 2px 8px;
  border-radius: 8px;
}

.start-btn {
  background-color: #7ae582;
  border-radius: 28px;
  border: 3px solid #2d3436;
  padding: 16px;
  margin: 24px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.start-btn-text {
  font-size: 20px;
  font-weight: bold;
  color: #2d3436;
}

.empty-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-text {
  font-size: 16px;
  color: #636e72;
}
</style>
