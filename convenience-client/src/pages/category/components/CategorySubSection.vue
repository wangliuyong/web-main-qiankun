<template>
  <view class="category-subs">
    <CategorySubGrid v-if="children.length" :list="children" @select="emit('select', $event)" />
    <u-empty v-else mode="data" text="暂无子分类" />
  </view>
</template>

<script setup lang="ts">
import CategorySubGrid from '@/components/CategorySubGrid/CategorySubGrid.vue';
import type { CategoryItem } from '@/types/city-info';

defineProps<{
  children: CategoryItem[];
}>();

const emit = defineEmits<{
  select: [item: CategoryItem];
}>();
</script>

<style lang="scss" scoped>
.category-subs {
  padding-bottom: 16rpx;
}
</style>
