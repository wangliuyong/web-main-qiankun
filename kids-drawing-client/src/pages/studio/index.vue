<template>
  <view class="page-root page-studio">
    <view class="page-body">
      <view class="safe-top" :style="{ height: statusBarHeight + 'px' }" />
      <view class="studio-header">
        <view class="header-left" @click="goBack">
          <text class="back-text">←</text>
        </view>
        <text class="header-title">{{ pageTitle }}</text>
        <view class="header-right" @click="onComplete">
          <text class="complete-text">完成</text>
        </view>
      </view>

      <view class="studio-layout">
        <!-- 左侧：引导 + 工具（横屏固定宽度，竖屏在上） -->
        <view class="studio-side">
          <StepGuide
            v-if="lesson"
            v-model:current-step="currentStep"
            v-model:show-guide="showGuide"
            :total-steps="totalSteps"
            :hint-text="currentHint"
            :shape-type="currentShapeType"
            @next="onStepNext"
          />

          <DrawToolbar
            v-model:brush-size="brushSize"
            v-model:is-eraser="isEraser"
            @undo="onUndo"
            @clear="onClear"
          />

          <ColorPalette v-model="brushColor" />

          <view class="side-actions">
            <view class="action-btn save-btn" @click="onSave">
              <text class="action-text">保存作品</text>
            </view>
          </view>
        </view>

        <!-- 右侧：画布主区域 -->
        <view class="studio-main">
          <view class="canvas-area">
            <DrawCanvas
              ref="canvasRef"
              :brush-color="brushColor"
              :brush-size="brushSize"
              :is-eraser="isEraser"
              @stroke-change="onStrokeChange"
            />
          </view>
        </view>
      </view>
    </view>

    <StarReward
      v-model:visible="showReward"
      :star-count="earnedStars"
      :subtitle="rewardSubtitle"
      @close="onRewardClose"
    />

    <KidTabBar v-if="isFreeMode" :current="1" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import DrawCanvas from '@/components/DrawCanvas/DrawCanvas.vue';
import ColorPalette from '@/components/ColorPalette/ColorPalette.vue';
import DrawToolbar from '@/components/DrawToolbar/DrawToolbar.vue';
import StepGuide from '@/components/StepGuide/StepGuide.vue';
import StarReward from '@/components/StarReward/StarReward.vue';
import KidTabBar from '@/components/KidTabBar/KidTabBar.vue';
import { useKidsStore } from '@/stores/kids';
import { queryLessonById, calcRewardStars } from '@/utils/lesson-loader';
import type { LessonItem } from '@/types/lesson';

interface DrawCanvasExpose {
  undo: () => boolean;
  clear: () => void;
  exportImage: () => string;
}

const kidsStore = useKidsStore();
const statusBarHeight = ref(0);
const lesson = ref<LessonItem | null>(null);
const isFreeMode = ref(true);

const brushColor = ref('#2D3436');
const brushSize = ref(6);
const isEraser = ref(false);
const strokeCount = ref(0);
const currentStep = ref(0);
const showGuide = ref(true);
const completedSteps = ref(0);

const showReward = ref(false);
const earnedStars = ref(0);
const rewardSubtitle = ref('');

const canvasRef = ref<DrawCanvasExpose | null>(null);

const pageTitle = computed(() => lesson.value?.title ?? '自由画板');
const totalSteps = computed(() => lesson.value?.steps.length ?? 0);

const currentHint = computed(() => {
  if (!lesson.value) return '自由创作吧！';
  const steps = lesson.value.steps;
  if (currentStep.value < steps.length) return steps[currentStep.value].hint;
  return '完成所有步骤啦！';
});

const currentShapeType = computed(() => {
  if (!lesson.value) return 'free';
  const steps = lesson.value.steps;
  if (currentStep.value < steps.length) return steps[currentStep.value].shapeType;
  return 'free';
});

function onStrokeChange(count: number): void {
  strokeCount.value = count;
}

function onStepNext(): void {
  completedSteps.value += 1;
}

function onUndo(): void {
  canvasRef.value?.undo();
}

function onClear(): void {
  uni.showModal({
    title: '清空画布',
    content: '确定要清空所有笔画吗？',
    success: (res) => {
      if (res.confirm) {
        canvasRef.value?.clear();
        strokeCount.value = 0;
      }
    },
  });
}

function onSave(): void {
  const base64 = canvasRef.value?.exportImage() ?? '';
  if (!base64) {
    uni.showToast({ title: '画布未就绪', icon: 'none' });
    return;
  }
  const title = lesson.value?.title ?? '自由创作';
  const lid = lesson.value?.id ?? 'free';
  const ok = kidsStore.postAddWork(lid, title, base64);
  uni.showToast({
    title: ok ? '作品已保存！' : '作品已满，请删除旧作',
    icon: ok ? 'success' : 'none',
  });
}

function onComplete(): void {
  if (!lesson.value) {
    onSave();
    return;
  }
  const l = lesson.value;
  const stars = calcRewardStars(l, strokeCount.value, completedSteps.value, l.steps.length);
  if (stars === 0) {
    uni.showToast({ title: `再画几笔吧！至少 ${l.minStrokes} 笔`, icon: 'none' });
    return;
  }
  earnedStars.value = stars;
  rewardSubtitle.value = `你完成了「${l.title}」`;
  kidsStore.postLessonComplete(l, stars, strokeCount.value);
  showReward.value = true;
  onSave();
}

function onRewardClose(): void {
  uni.navigateBack({});
}

function goBack(): void {
  if (isFreeMode.value) {
    uni.redirectTo({ url: '/pages/home/index' });
  } else {
    uni.navigateBack({});
  }
}

onLoad((options) => {
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight || 0;
  kidsStore.setTabIndex(1);
  const id = options?.lessonId as string | undefined;
  if (id) {
    lesson.value = queryLessonById(id);
    isFreeMode.value = false;
  } else {
    isFreeMode.value = true;
  }
});
</script>

<style lang="scss" scoped>
.page-studio .page-body {
  overflow: hidden;
}

.studio-header {
  @include kd-top-bar;
  justify-content: space-between;
  flex-shrink: 0;
}

.header-left,
.header-right {
  min-width: 72px;
  @include kd-touch-target;
  display: flex;
  align-items: center;
}

.header-right {
  justify-content: flex-end;
}

.back-text {
  font-size: $kd-text-xl;
  color: $kd-ink;
  font-weight: bold;
}

.header-title {
  font-size: $kd-text-lg;
  font-weight: bold;
  color: $kd-ink;
}

.complete-text {
  font-size: $kd-text-base;
  font-weight: bold;
  color: $kd-accent;
}

/** 竖屏：上下堆叠；横屏：左工具 + 右画布 */
.studio-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;

  @include kd-landscape {
    flex-direction: row;
    max-width: $kd-page-max;
    width: 100%;
    margin: 0 auto;
    padding: $kd-space-sm $kd-space-lg;
    box-sizing: border-box;
  }
}

.studio-side {
  flex-shrink: 0;
  overflow-y: auto;

  @include kd-landscape {
    width: $kd-studio-side-width;
    max-height: 100%;
    padding-right: $kd-space-sm;
    box-sizing: border-box;
  }
}

.studio-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  padding: $kd-space-xs $kd-space-sm;

  @include kd-landscape {
    padding: 0;
  }
}

.canvas-area {
  flex: 1;
  min-height: 280px;
  min-width: 0;
  display: flex;
  flex-direction: column;

  @include kd-landscape {
    min-height: 0;
    height: 100%;
  }
}

.side-actions {
  padding: $kd-space-xs $kd-space-sm $kd-space-sm;

  @include kd-landscape {
    padding: $kd-space-sm 0;
  }
}

.action-btn {
  border-radius: $kd-radius-lg;
  padding: $kd-space-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid $kd-border-color;
  @include kd-touch-target;

  &:active {
    transform: scale(0.98);
  }
}

.save-btn {
  background-color: $kd-teal;
}

.action-text {
  font-size: $kd-text-base;
  font-weight: bold;
  color: $kd-ink;
}
</style>
