<template>
  <view class="page-root">
    <view class="page-body">
      <view class="safe-top" :style="{ height: statusBarHeight + 'px' }" />
      <view class="home-header">
        <text class="mascot mascot-float">🐰</text>
        <view class="header-text">
          <text class="greeting">你好，{{ kidsStore.profile.nickname }}！</text>
          <text class="subtitle">小兔子陪你一起画画</text>
        </view>
        <view class="star-badge">
          <text class="star-count">⭐ {{ kidsStore.totalStars }}</text>
        </view>
      </view>

      <scroll-view class="home-scroll" scroll-y>
        <view class="page-content home-inner">
          <!-- 横屏：继续学习 + 每日挑战并排 -->
          <view class="hero-row">
            <view class="card continue-card" @click="onContinue">
              <text class="card-label">继续学习</text>
              <text class="card-title">{{ continueTitle }}</text>
              <text class="card-desc">{{ continueDesc }}</text>
              <view class="btn-primary card-cta">
                <text class="btn-primary-text">开始画画</text>
              </view>
            </view>

            <view class="card challenge-card" @click="goStudio">
              <text class="card-label">每日挑战</text>
              <text class="card-desc">连续学习 {{ kidsStore.streakDays }} 天，加油！</text>
            </view>
          </view>

          <text class="section-title">探索</text>
          <view class="quick-grid">
            <view
              v-for="item in quickActions"
              :key="item.key"
              class="quick-item"
              @click="onQuickAction(item.key)"
            >
              <text class="quick-animal">{{ item.animal }}</text>
              <text class="quick-icon">{{ item.icon }}</text>
              <text class="quick-label">{{ item.label }}</text>
            </view>
          </view>

          <text class="section-title">学习路线</text>
          <view class="chapter-list">
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
          </view>
        </view>
      </scroll-view>
    </view>

    <KidTabBar :current="0" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import KidTabBar from '@/components/KidTabBar/KidTabBar.vue';
import { QUICK_ACTIONS } from '@/constants/theme';
import { useKidsStore } from '@/stores/kids';
import { queryChapters, queryContinueLesson, queryChapterCompletedCount } from '@/utils/lesson-loader';
import type { ChapterItem } from '@/types/lesson';

const kidsStore = useKidsStore();
const statusBarHeight = ref(0);
const chapters = ref<ChapterItem[]>(queryChapters());
const quickActions = QUICK_ACTIONS;

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

/** 快捷入口统一路由 */
function onQuickAction(key: string): void {
  switch (key) {
    case 'map':
      goCourseMap();
      break;
    case 'studio':
      goStudio();
      break;
    case 'gallery':
      goGallery();
      break;
    case 'profile':
      goProfile();
      break;
  }
}

onLoad(() => {
  kidsStore.setTabIndex(0);
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight || 0;
});
</script>

<style lang="scss" scoped>
.home-header {
  @include kd-top-bar;
}

.mascot {
  font-size: 48px;
  margin-right: $kd-space-sm;

  @include kd-landscape {
    font-size: 56px;
  }
}

.mascot-float {
  @include kd-animate-infinite(kd-float, 2.5s);
}

.header-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.greeting {
  font-size: $kd-text-xl;
  font-weight: bold;
  color: $kd-ink;

  @include kd-landscape {
    font-size: $kd-text-2xl;
  }
}

.subtitle {
  font-size: $kd-text-sm;
  color: $kd-ink-muted;
  margin-top: 4px;
}

.star-badge {
  background-color: $kd-surface;
  border-radius: $kd-radius-md;
  padding: 8px 14px;
  border: 2px solid $kd-border-color;
}

.star-count {
  font-size: $kd-text-base;
  font-weight: bold;
  color: $kd-ink;
}

.home-scroll {
  flex: 1;
  height: 0;
}

.home-inner {
  padding-bottom: $kd-space-lg;
}

.hero-row {
  display: flex;
  flex-direction: column;
  gap: $kd-space-sm;

  @include kd-landscape {
    flex-direction: row;
    gap: $kd-space-md;
  }
}

.hero-row .card {
  margin: $kd-space-xs 0;

  @include kd-landscape {
    flex: 1;
    margin: $kd-space-sm 0;
  }
}

.continue-card {
  background: linear-gradient(135deg, rgba(149, 225, 211, 0.85) 0%, rgba(168, 230, 207, 0.9) 100%);
}

.challenge-card {
  background: linear-gradient(135deg, rgba(255, 214, 165, 0.9) 0%, rgba(255, 181, 197, 0.75) 100%);
}

.card-label {
  font-size: $kd-text-sm;
  color: $kd-ink-muted;
  margin-bottom: 4px;
  display: block;
}

.card-title {
  font-size: $kd-text-xl;
  font-weight: bold;
  color: $kd-ink;
  display: block;
}

.card-desc {
  font-size: $kd-text-sm;
  color: $kd-ink-muted;
  margin-top: 4px;
  display: block;
}

.card-cta {
  margin-top: $kd-space-sm;
  align-self: flex-start;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $kd-space-sm;
  padding: 0 $kd-space-md;

  @include kd-tablet {
    grid-template-columns: repeat(4, 1fr);
    padding: 0;
  }
}

.quick-item {
  @include kd-card;
  @include kd-touch-target;
  padding: $kd-space-md;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, $kd-surface 0%, rgba(255, 245, 250, 0.95) 100%);

  &:active {
    transform: scale(0.97);
  }
}

.quick-animal {
  position: absolute;
  top: 6px;
  right: 8px;
  font-size: 18px;
  opacity: 0.85;
}

.quick-icon {
  font-size: 32px;

  @include kd-landscape {
    font-size: 40px;
  }
}

.quick-label {
  font-size: $kd-text-sm;
  font-weight: bold;
  color: $kd-ink;
  margin-top: $kd-space-xs;
}

.chapter-list {
  @include kd-landscape {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $kd-space-sm;
    padding: 0;
  }
}

.chapter-preview {
  display: flex;
  flex-direction: row;
  align-items: center;
  @include kd-card;
  padding: $kd-space-sm $kd-space-md;
  margin: $kd-space-xs $kd-space-md;

  @include kd-landscape {
    margin: 0;
  }

  &:active {
    transform: scale(0.98);
  }
}

.chapter-icon {
  font-size: 28px;
  margin-right: $kd-space-sm;
}

.chapter-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chapter-name {
  font-size: $kd-text-base;
  font-weight: bold;
  color: $kd-ink;
}

.chapter-progress {
  font-size: $kd-text-xs;
  color: $kd-ink-muted;
  margin-top: 2px;
}

.chapter-arrow {
  font-size: 24px;
  color: $kd-ink-muted;
}
</style>
