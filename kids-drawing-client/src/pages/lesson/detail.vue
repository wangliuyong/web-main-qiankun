<template>
  <view class="page-root page-sub">
    <view class="page-body">
      <view class="safe-top" :style="{ height: statusBarHeight + 'px' }" />
      <view class="kd-nav-bar">
        <view class="kd-nav-back" @click="goBack">
          <text class="kd-nav-back-text">← 返回</text>
        </view>
        <text class="kd-nav-title">课时详情</text>
        <view class="kd-nav-placeholder" />
      </view>

      <scroll-view v-if="lesson" class="detail-scroll" scroll-y>
        <view class="page-content detail-inner">
          <view class="detail-layout">
            <view class="card intro-card">
              <text class="lesson-title">{{ lesson.title }}</text>
              <text class="lesson-desc">{{ lesson.description }}</text>
              <view class="difficulty-row">
                <text class="difficulty-label">难度</text>
                <text v-for="i in lesson.difficulty" :key="i" class="diff-star">⭐</text>
              </view>
            </view>

            <view class="steps-panel">
              <text class="section-title steps-title">学习步骤</text>
              <view v-for="step in lesson.steps" :key="step.order" class="step-preview">
                <text class="step-num">{{ step.order }}</text>
                <text class="step-hint">{{ step.hint }}</text>
                <text v-if="step.required" class="step-required">必做</text>
              </view>
            </view>
          </view>

          <view class="start-btn" @click="onStart">
            <text class="start-btn-text">开始画画</text>
          </view>
        </view>
      </scroll-view>

      <view v-else class="empty-wrap">
        <text class="empty-text">课时不存在</text>
      </view>
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
.detail-scroll {
  flex: 1;
  height: 0;
}

.detail-inner {
  padding-bottom: $kd-space-xl;
}

.detail-layout {
  @include kd-landscape {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: $kd-space-lg;
    align-items: start;
  }
}

.intro-card {
  margin-top: $kd-space-sm;
}

.lesson-title {
  font-size: $kd-text-2xl;
  font-weight: bold;
  color: $kd-ink;
  display: block;
}

.lesson-desc {
  font-size: $kd-text-sm;
  color: $kd-ink-muted;
  margin-top: $kd-space-xs;
  display: block;
  line-height: 1.5;
}

.difficulty-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: $kd-space-sm;
  gap: 4px;
}

.difficulty-label {
  font-size: $kd-text-sm;
  color: $kd-ink-muted;
  margin-right: 4px;
}

.steps-title {
  margin-left: 0;
  margin-top: $kd-space-md;

  @include kd-landscape {
    margin-top: 0;
  }
}

.step-preview {
  display: flex;
  flex-direction: row;
  align-items: center;
  @include kd-card;
  border-width: 2px;
  padding: $kd-space-sm $kd-space-md;
  margin: $kd-space-xs 0;
}

.step-num {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: $kd-teal;
  text-align: center;
  font-size: $kd-text-sm;
  font-weight: bold;
  color: $kd-ink;
  margin-right: $kd-space-sm;
  line-height: 32px;
  flex-shrink: 0;
}

.step-hint {
  flex: 1;
  font-size: $kd-text-base;
  color: $kd-ink;
}

.step-required {
  font-size: $kd-text-xs;
  color: $kd-accent;
  background-color: $kd-peach;
  padding: 2px 8px;
  border-radius: $kd-radius-sm;
  flex-shrink: 0;
}

.start-btn {
  background-color: $kd-green;
  border-radius: $kd-radius-lg;
  border: $kd-border-width solid $kd-border-color;
  padding: $kd-space-md;
  margin-top: $kd-space-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  @include kd-touch-target;
  max-width: 400px;

  @include kd-landscape {
    margin-left: auto;
    margin-right: auto;
  }

  &:active {
    transform: scale(0.98);
  }
}

.start-btn-text {
  font-size: $kd-text-xl;
  font-weight: bold;
  color: $kd-ink;
}

.empty-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-text {
  font-size: $kd-text-base;
  color: $kd-ink-muted;
}
</style>
