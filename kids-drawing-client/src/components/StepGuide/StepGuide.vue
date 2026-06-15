<template>
  <view class="step-guide">
    <!-- 小动物引导伙伴 -->
    <view class="buddy-row">
      <text :key="buddyKey" class="buddy-emoji buddy-float">{{ buddyEmoji }}</text>
      <view class="buddy-bubble">
        <text :key="hintKey" class="buddy-say">{{ buddySay }}</text>
      </view>
    </view>

    <view class="step-header">
      <text class="step-title">第 {{ currentStep + 1 }} / {{ totalSteps }} 步</text>
      <view class="toggle-btn" @click="emit('update:showGuide', !showGuide)">
        <text class="toggle-text">{{ showGuide ? '隐藏参考' : '显示参考' }}</text>
      </view>
    </view>

    <text :key="hintKey" class="step-hint step-hint-animate">{{ hintText }}</text>

    <view v-if="showGuide" class="guide-overlay">
      <view class="guide-shape-wrap">
        <text :key="shapeKey" class="guide-emoji guide-emoji-animate">{{ shapeEmoji }}</text>
        <text :key="labelKey" class="guide-shape-label guide-label-animate">{{ shapeLabel }}</text>
      </view>
    </view>

    <view class="step-dots">
      <view
        v-for="idx in totalSteps"
        :key="idx"
        class="step-dot"
        :class="{
          'step-dot-done': idx - 1 <= currentStep,
          'step-dot-active': idx - 1 === currentStep,
        }"
      />
    </view>

    <view
      v-if="currentStep < totalSteps - 1"
      class="next-btn next-btn-glow"
      @click="onNext"
    >
      <text class="next-btn-text">下一步</text>
      <text class="next-btn-arrow">→</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { GUIDE_BUDDIES, GUIDE_SHAPE_EMOJI } from '@/constants/theme';

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

/** 形状参考 emoji（小动物主题） */
const shapeEmoji = computed(() => GUIDE_SHAPE_EMOJI[props.shapeType] ?? '🎨');
const shapeLabel = computed(() => `跟着画：${props.hintText}`);

/** 按步骤轮换引导小动物 */
const buddyEmoji = computed(
  () => GUIDE_BUDDIES[props.currentStep % GUIDE_BUDDIES.length],
);

/** 伙伴鼓励语 */
const buddySay = computed(() => {
  if (props.currentStep === 0) return '跟我一起画吧！';
  if (props.currentStep >= props.totalSteps - 1) return '最后一步，加油！';
  return '画得真棒，继续！';
});

/** :key 变化触发 CSS 入场动画 */
const hintKey = computed(() => `hint-${props.currentStep}`);
const shapeKey = computed(() => `shape-${props.currentStep}-${props.shapeType}`);
const labelKey = computed(() => `label-${props.currentStep}`);
const buddyKey = computed(() => `buddy-${props.currentStep}`);

function onNext(): void {
  emit('update:currentStep', props.currentStep + 1);
  emit('next');
}
</script>

<style lang="scss" scoped>
.step-guide {
  padding: $kd-space-md;
  background: linear-gradient(180deg, $kd-surface 0%, $kd-surface-soft 100%);
  border-radius: $kd-radius-lg;
  border: $kd-border-width solid $kd-border-color;
  margin: $kd-space-xs $kd-space-sm;
  box-shadow: $kd-shadow-float;

  @include kd-landscape {
    margin: $kd-space-xs 0;
  }
}

/** 小动物伙伴行 */
.buddy-row {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: $kd-space-sm;
  gap: $kd-space-sm;
}

.buddy-emoji {
  font-size: 44px;
  flex-shrink: 0;

  @include kd-landscape {
    font-size: 52px;
  }
}

.buddy-float {
  @include kd-animate-infinite(kd-float, 2.4s);
}

.buddy-bubble {
  flex: 1;
  background-color: $kd-pink;
  border-radius: $kd-radius-md $kd-radius-md $kd-radius-md 4px;
  padding: 10px 14px;
  border: 2px solid $kd-border-color;
}

.buddy-say {
  font-size: $kd-text-sm;
  font-weight: bold;
  color: $kd-ink;
}

.step-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $kd-space-xs;
}

.step-title {
  font-size: $kd-text-base;
  font-weight: bold;
  color: $kd-ink;
}

.toggle-btn {
  background-color: $kd-mint;
  border-radius: $kd-radius-sm;
  padding: 6px 12px;
  border: 2px solid $kd-border-color;

  &:active {
    transform: scale(0.96);
  }
}

.toggle-text {
  font-size: $kd-text-xs;
  color: $kd-ink;
  font-weight: 600;
}

.step-hint {
  font-size: $kd-text-lg;
  color: $kd-pink-deep;
  font-weight: bold;
  margin-bottom: $kd-space-sm;
  display: block;
}

.step-hint-animate {
  @include kd-animate(kd-hint-slide, 0.45s, ease);
}

.guide-overlay {
  background: linear-gradient(135deg, rgba(255, 214, 165, 0.45) 0%, rgba(255, 181, 197, 0.35) 100%);
  border-radius: $kd-radius-md;
  padding: $kd-space-md;
  display: flex;
  align-items: center;
  margin-bottom: $kd-space-sm;
  border: 2px dashed $kd-lavender;
}

.guide-shape-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.guide-emoji {
  font-size: 56px;

  @include kd-landscape {
    font-size: 64px;
  }
}

.guide-emoji-animate {
  @include kd-animate(kd-bounce-in, 0.55s, cubic-bezier(0.16, 1, 0.3, 1));
}

.guide-shape-label {
  font-size: $kd-text-sm;
  color: $kd-ink-muted;
  margin-top: 6px;
}

.guide-label-animate {
  @include kd-animate(kd-hint-slide, 0.4s, ease, 1);
  animation-delay: 0.1s;
  animation-fill-mode: both;
}

.step-dots {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: $kd-space-sm 0;
  gap: 8px;
}

.step-dot {
  width: 12px;
  height: 12px;
  border-radius: $kd-radius-pill;
  background-color: $kd-border-light;
  transition: background-color 0.25s ease, transform 0.25s ease;
}

.step-dot-done {
  background-color: $kd-yellow;
}

.step-dot-active {
  background-color: $kd-pink-deep;

  @include kd-animate-infinite(kd-dot-pulse, 1.2s);
}

.next-btn {
  background: linear-gradient(135deg, $kd-mint 0%, $kd-green 100%);
  border-radius: $kd-radius-pill;
  padding: 12px $kd-space-lg;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: $kd-border-width solid $kd-border-strong;
  box-shadow: $kd-shadow-btn;
  gap: 6px;

  &:active {
    transform: scale(0.97) translateY(2px);
    box-shadow: 0 2px 0 #c9b8d9;
  }
}

.next-btn-glow {
  @include kd-animate-infinite(kd-btn-glow, 2s);
}

.next-btn-text {
  font-size: $kd-text-base;
  font-weight: bold;
  color: $kd-ink;
}

.next-btn-arrow {
  font-size: $kd-text-lg;
  font-weight: bold;
  color: $kd-ink;
}
</style>
