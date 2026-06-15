<template>
  <view v-if="visible" class="star-reward-mask" @click="onClose">
    <view class="star-reward-card card-pop" @click.stop>
      <text class="reward-mascot mascot-float">🐰</text>
      <text class="reward-title">太棒了！</text>
      <text class="reward-sub">{{ subtitle }}</text>
      <view class="stars-row">
        <text
          v-for="i in 3"
          :key="i"
          class="star-icon"
          :class="[
            i <= starCount ? 'star-active' : 'star-inactive',
            i <= starCount ? `star-delay-${i}` : '',
          ]"
        >⭐</text>
      </view>
      <text class="reward-desc">获得 {{ starCount }} 颗星星</text>
      <view class="reward-btn" @click="onClose">
        <text class="reward-btn-text">继续学习</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    visible?: boolean;
    starCount?: number;
    subtitle?: string;
  }>(),
  {
    visible: false,
    starCount: 1,
    subtitle: '你完成了一节课时！',
  },
);

const emit = defineEmits<{
  'update:visible': [value: boolean];
  close: [];
}>();

function onClose(): void {
  emit('update:visible', false);
  emit('close');
}
</script>

<style lang="scss" scoped>
.star-reward-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(93, 78, 96, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.star-reward-card {
  width: 300px;
  max-width: 90vw;
  background: linear-gradient(180deg, $kd-surface 0%, $kd-surface-soft 100%);
  border-radius: $kd-radius-lg;
  border: $kd-border-width solid $kd-yellow;
  padding: $kd-space-xl $kd-space-lg;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: $kd-shadow-float;
}

.card-pop {
  @include kd-animate(kd-bounce-in, 0.55s, cubic-bezier(0.16, 1, 0.3, 1));
}

.reward-mascot {
  font-size: 56px;
  margin-bottom: $kd-space-xs;
}

.mascot-float {
  @include kd-animate-infinite(kd-float, 2s);
}

.reward-title {
  font-size: $kd-text-2xl;
  font-weight: bold;
  color: $kd-ink;
  margin-bottom: $kd-space-xs;
}

.reward-sub {
  font-size: $kd-text-base;
  color: $kd-ink-muted;
  margin-bottom: $kd-space-md;
  text-align: center;
}

.stars-row {
  display: flex;
  flex-direction: row;
  margin-bottom: $kd-space-sm;
  gap: 4px;
}

.star-icon {
  font-size: 40px;
}

.star-active {
  opacity: 1;

  @include kd-animate-infinite(kd-sparkle, 1.2s);
}

.star-delay-1 {
  animation-delay: 0s;
}

.star-delay-2 {
  animation-delay: 0.15s;
}

.star-delay-3 {
  animation-delay: 0.3s;
}

.star-inactive {
  opacity: 0.2;
}

.reward-desc {
  font-size: $kd-text-lg;
  color: $kd-pink-deep;
  font-weight: bold;
  margin-bottom: $kd-space-lg;
}

.reward-btn {
  background: linear-gradient(135deg, $kd-yellow 0%, $kd-peach 100%);
  border-radius: $kd-radius-pill;
  padding: 12px 32px;
  border: $kd-border-width solid $kd-border-strong;
  box-shadow: $kd-shadow-btn;

  &:active {
    transform: scale(0.97);
  }
}

.reward-btn-text {
  font-size: $kd-text-lg;
  font-weight: bold;
  color: $kd-ink;
}
</style>
