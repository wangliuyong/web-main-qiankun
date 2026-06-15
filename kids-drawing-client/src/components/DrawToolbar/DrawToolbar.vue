<template>
  <view class="draw-toolbar">
    <view class="tool-btn" :class="{ 'tool-btn-active': !isEraser }" @click="onBrush">
      <text class="tool-icon">🖌️</text>
      <text class="tool-label">画笔</text>
    </view>
    <view class="tool-btn" :class="{ 'tool-btn-active': isEraser }" @click="onEraser">
      <text class="tool-icon">🧽</text>
      <text class="tool-label">橡皮</text>
    </view>
    <view class="size-group">
      <view
        v-for="size in sizes"
        :key="size"
        class="size-dot"
        :class="{ 'size-dot-active': brushSize === size }"
        :style="{ width: size + 8 + 'px', height: size + 8 + 'px' }"
        @click="onSizeChange(size)"
      />
    </view>
    <view class="tool-btn" @click="emit('undo')">
      <text class="tool-icon">↩️</text>
      <text class="tool-label">撤销</text>
    </view>
    <view class="tool-btn" @click="emit('clear')">
      <text class="tool-icon">🗑️</text>
      <text class="tool-label">清空</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    brushSize?: number;
    isEraser?: boolean;
  }>(),
  { brushSize: 6, isEraser: false },
);

const emit = defineEmits<{
  'update:brushSize': [size: number];
  'update:isEraser': [value: boolean];
  undo: [];
  clear: [];
}>();

const sizes = [4, 8, 14];

function onBrush(): void {
  emit('update:isEraser', false);
}

function onEraser(): void {
  emit('update:isEraser', true);
}

function onSizeChange(size: number): void {
  emit('update:brushSize', size);
}
</script>

<style lang="scss" scoped>
.draw-toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 10px 8px;
  background-color: $kd-surface;
  border-radius: $kd-radius-md;
  border: $kd-border-width solid $kd-border-color;
  margin: $kd-space-xs $kd-space-sm;
  box-shadow: $kd-shadow-card;

  @include kd-landscape {
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: $kd-space-xs;
    padding: $kd-space-sm;
    margin: $kd-space-xs 0;
  }
}

.tool-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 12px;
  min-width: 48px;
  min-height: 48px;
}

.tool-btn-active {
  background: linear-gradient(135deg, $kd-pink 0%, $kd-lavender 100%);
}

.tool-icon {
  font-size: 22px;
}

.tool-label {
  font-size: 11px;
  color: $kd-ink;
  margin-top: 2px;
}

.size-group {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.size-dot {
  background-color: $kd-ink;
  border-radius: 50%;
  margin: 0 4px;
  border: 2px solid transparent;
}

.size-dot-active {
  border-color: $kd-pink-deep;
}
</style>
