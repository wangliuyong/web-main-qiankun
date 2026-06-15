<template>
  <view class="cv-section">
    <SectionHead title="热门分类" action-text="全部分类" @action="emit('viewAll')" />
    <view v-if="loading" class="home-categories__sk">
      <SkeletonBlock
        v-for="i in 8"
        :key="i"
        width="calc(25% - 12rpx)"
        height="140rpx"
        radius="20rpx"
        :shimmer="true"
      />
    </view>
    <CategoryGrid v-else :list="categories" @select="emit('select', $event)" />
  </view>
</template>

<script setup lang="ts">
import CategoryGrid from '@/components/CategoryGrid/CategoryGrid.vue';
import SectionHead from '@/components/SectionHead/SectionHead.vue';
import SkeletonBlock from '@/components/SkeletonBlock/SkeletonBlock.vue';
import type { CategoryItem } from '@/types/city-info';

defineProps<{
  loading: boolean;
  categories: CategoryItem[];
}>();

const emit = defineEmits<{
  viewAll: [];
  select: [item: CategoryItem];
}>();
</script>

<style lang="scss" scoped>
.home-categories__sk {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
</style>
