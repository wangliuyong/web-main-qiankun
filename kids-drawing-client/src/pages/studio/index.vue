<template>
  <view class="page-root">
    <view class="safe-top" :style="{ height: statusBarHeight + 'px' }" />
    <view class="studio-header">
      <view class="header-left" @click="goBack">
        <text class="back-text">←</text>
      </view>
      <text class="header-title">{{ pageTitle }}</text>
      <view class="header-right" @click="onComplete">
        <text class="complete-text">完成 ✓</text>
      </view>
    </view>

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

    <view class="canvas-area">
      <DrawCanvas
        ref="canvasRef"
        :brush-color="brushColor"
        :brush-size="brushSize"
        :is-eraser="isEraser"
        @stroke-change="onStrokeChange"
      />
    </view>

    <view class="bottom-actions">
      <view class="action-btn save-btn" @click="onSave">
        <text class="action-text">💾 保存作品</text>
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

/** DrawCanvas 暴露的方法 */
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
.studio-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background-color: #ffd166;
  border-bottom: 3px solid #2d3436;
}

.header-left, .header-right {
  min-width: 60px;
}

.back-text {
  font-size: 22px;
  color: #2d3436;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #2d3436;
}

.complete-text {
  font-size: 16px;
  font-weight: bold;
  color: #ff6b6b;
  text-align: right;
}

.canvas-area {
  flex: 1;
  margin: 8px 12px;
  min-height: 300px;
  display: flex;
}

.bottom-actions {
  padding: 8px 16px 4px;
}

.action-btn {
  border-radius: 20px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #2d3436;
}

.save-btn {
  background-color: #4ecdc4;
}

.action-text {
  font-size: 16px;
  font-weight: bold;
  color: #2d3436;
}
</style>
