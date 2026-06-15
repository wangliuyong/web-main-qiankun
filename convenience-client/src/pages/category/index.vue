<template>
  <view class="page-category cv-page" :style="pageStyle">
    <CategorySkeleton v-if="loading" />

    <template v-else>
      <CategoryHero :root-count="categories.length" :sub-count="totalSubCount" />

      <view class="page-category__body">
        <CategoryRootSection
          :categories="categories"
          :active-root-id="activeRootId"
          @select="onSelectRoot"
        />

        <CategoryActiveBanner
          :root="activeRoot"
          :tone-index="activeRootIndex"
          :child-count="activeChildren.length"
        />

        <CategorySubSection :children="activeChildren" @select="goList" />
      </view>

      <AppTabBar page-path="pages/category/index" />
    </template>
  </view>
</template>

<script setup lang="ts">
import AppTabBar from '@/components/AppTabBar/AppTabBar.vue';
import { useTabBarPage } from '@/composables/useTabBarPage';
import { useSafeAreaInsets } from '@/composables/useSafeAreaInsets';
import CategoryActiveBanner from './components/CategoryActiveBanner.vue';
import CategoryHero from './components/CategoryHero.vue';
import CategoryRootSection from './components/CategoryRootSection.vue';
import CategorySkeleton from './components/CategorySkeleton.vue';
import CategorySubSection from './components/CategorySubSection.vue';
import { useCategoryPage } from './composables/useCategoryPage';

useTabBarPage();
const { pageStyle } = useSafeAreaInsets();

const {
  categories,
  activeRootId,
  activeRoot,
  activeRootIndex,
  activeChildren,
  totalSubCount,
  loading,
  onSelectRoot,
  goList,
} = useCategoryPage();
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.page-category__body {
  @include cv-body-sheet;
  margin-top: -36rpx;
}
</style>
