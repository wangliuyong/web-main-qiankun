<template>
  <view class="category-root cv-card">
    <CategoryRootStrip
      :list="categories"
      :active-id="activeRootId"
      layout="scroll"
      @select="emit('select', $event)"
    />
  </view>
</template>

<script setup lang="ts">
import CategoryRootStrip from '@/components/CategoryRootStrip/CategoryRootStrip.vue';
import type { CategoryItem } from '@/types/city-info';

defineProps<{
  categories: CategoryItem[];
  activeRootId: number;
}>();

const emit = defineEmits<{
  select: [item: CategoryItem];
}>();
</script>

<style lang="scss" scoped>
.category-root {
  padding: 20rpx 16rpx 16rpx;
  margin-bottom: 20rpx;
}
</style>
