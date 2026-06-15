<template>
  <view class="step-guide">
    <view class="step-header">
      <text class="step-title">第 {{ currentStep + 1 }} / {{ totalSteps }} 步</text>
      <view class="toggle-btn" @click="emit('update:showGuide', !showGuide)">
        <text class="toggle-text">{{ showGuide ? '隐藏参考' : '显示参考' }}</text>
      </view>
    </view>
    <text class="step-hint">{{ hintText }}</text>
    <view v-if="showGuide" class="guide-overlay">
      <view class="guide-shape-wrap">
        <text class="guide-emoji">{{ shapeEmoji }}</text>
        <text class="guide-shape-label">{{ shapeLabel }}</text>
      </view>
    </view>
    <view class="step-dots">
      <view
        v-for="idx in totalSteps"
        :key="idx"
        class="step-dot"
        :class="{ 'step-dot-done': idx - 1 <= currentStep }"
      />
    </view>
    <view v-if="currentStep < totalSteps - 1" class="next-btn" @click="onNext">
      <text class="next-btn-text">下一步 →</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const SHAPE_EMOJI: Record<string, string> = {
  'line-h': '➡️', 'line-v': '⬇️', 'line-wave': '〰️', 'line-curve': '🛤️',
  'line-free': '✏️', rect: '⬜', 'rect-wide': '▬', circle: '⭕',
  'circle-small': '🔵', triangle: '🔺', mountain: '⛰️', rainbow: '🌈',
  flower: '🌸', grass: '🌿', sun: '☀️', 'sun-rays': '🌞',
  house: '🏠', cat: '🐱', star: '⭐', 'star-small': '✨',
  sky: '🌤️', free: '🎨', grid: '🔲',
};

const props = withDefaults(
  defineProps<{
    currentStep?: number;
    totalSteps?: number;
    hintText?: string;
    shapeType?: string;
    showGuide?: boolean;
  }>(),
  {
    currentStep: 0,
    totalSteps: 1,
    hintText: '',
    shapeType: 'free',
    showGuide: true,
  },
);

const emit = defineEmits<{
  'update:currentStep': [step: number];
  'update:showGuide': [value: boolean];
  next: [];
}>();

const shapeEmoji = computed(() => SHAPE_EMOJI[props.shapeType] ?? '🎨');
const shapeLabel = computed(() => `跟着画：${props.hintText}`);

function onNext(): void {
  emit('update:currentStep', props.currentStep + 1);
  emit('next');
}
</script>

<style lang="scss" scoped>
.step-guide {
  padding: 12px 16px;
  background-color: #ffffff;
  border-radius: 16px;
  border: 3px solid #2d3436;
  margin: 8px 12px;
}

.step-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.step-title {
  font-size: 16px;
  font-weight: bold;
  color: #2d3436;
}

.toggle-btn {
  background-color: #4ecdc4;
  border-radius: 12px;
  padding: 4px 10px;
}

.toggle-text {
  font-size: 12px;
  color: #2d3436;
}

.step-hint {
  font-size: 18px;
  color: #ff6b6b;
  font-weight: bold;
  margin-bottom: 8px;
}

.guide-overlay {
  background-color: rgba(255, 209, 102, 0.3);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.guide-shape-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.guide-emoji {
  font-size: 48px;
}

.guide-shape-label {
  font-size: 14px;
  color: #636e72;
  margin-top: 4px;
}

.step-dots {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 8px 0;
}

.step-dot {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: #dfe6e9;
  margin: 0 4px;
}

.step-dot-done {
  background-color: #ffd166;
}

.next-btn {
  background-color: #7ae582;
  border-radius: 20px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #2d3436;
}

.next-btn-text {
  font-size: 16px;
  font-weight: bold;
  color: #2d3436;
}
</style>
