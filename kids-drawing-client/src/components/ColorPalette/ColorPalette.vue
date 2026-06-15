<template>
  <view class="color-palette">
    <view
      v-for="color in colors"
      :key="color"
      class="color-item"
      :class="{ 'color-item-active': modelValue === color }"
      :style="{ backgroundColor: color }"
      @click="onSelect(color)"
    />
  </view>
</template>

<script setup lang="ts">
/** 儿童友好色板 */
const colors = [
  '#2D3436', '#FF6B6B', '#FFD166', '#4ECDC4',
  '#9B5DE5', '#7AE582', '#F15BB5', '#00BBF9',
  '#FFFFFF', '#FEE440',
];

const props = withDefaults(defineProps<{ modelValue?: string }>(), {
  modelValue: '#2D3436',
});

const emit = defineEmits<{
  'update:modelValue': [color: string];
  change: [color: string];
}>();

function onSelect(color: string): void {
  emit('update:modelValue', color);
  emit('change', color);
}
</script>

<style lang="scss" scoped>
.color-palette {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: $kd-space-xs $kd-space-sm;
  justify-content: center;

  @include kd-landscape {
    justify-content: flex-start;
    padding: $kd-space-xs 0;
  }
}

.color-item {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  border: $kd-border-width solid $kd-border-color;
  margin: 6px;
  @include kd-touch-target;

  @include kd-landscape {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 4px;
  }

  &:active {
    transform: scale(0.92);
  }
}

.color-item-active {
  border: 4px solid $kd-accent;
  transform: scale(1.08);
}
</style>
