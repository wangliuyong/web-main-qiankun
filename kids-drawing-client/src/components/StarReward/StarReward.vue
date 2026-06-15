<template>
  <view v-if="visible" class="star-reward-mask" @click="onClose">
    <view class="star-reward-card" @click.stop>
      <text class="reward-title">太棒了！🎉</text>
      <text class="reward-sub">{{ subtitle }}</text>
      <view class="stars-row">
        <text
          v-for="i in 3"
          :key="i"
          class="star-icon"
          :class="i <= starCount ? 'star-active' : 'star-inactive'"
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.star-reward-card {
  width: 280px;
  background-color: #ffffff;
  border-radius: 24px;
  border: 4px solid #ffd166;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.reward-title {
  font-size: 28px;
  font-weight: bold;
  color: #2d3436;
  margin-bottom: 8px;
}

.reward-sub {
  font-size: 16px;
  color: #636e72;
  margin-bottom: 16px;
}

.stars-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 12px;
}

.star-icon {
  font-size: 40px;
  margin: 0 4px;
}

.star-active {
  opacity: 1;
}

.star-inactive {
  opacity: 0.2;
}

.reward-desc {
  font-size: 18px;
  color: #ff6b6b;
  font-weight: bold;
  margin-bottom: 20px;
}

.reward-btn {
  background-color: #ffd166;
  border-radius: 24px;
  padding: 12px 32px;
  border: 3px solid #2d3436;
}

.reward-btn-text {
  font-size: 18px;
  font-weight: bold;
  color: #2d3436;
}
</style>
