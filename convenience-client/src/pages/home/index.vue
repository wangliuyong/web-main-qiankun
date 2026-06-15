<template>
  <view class="page-home" :style="pageStyle">
    <HomeHero
      :city-name="locationStore.cityName"
      :total-info-count="totalInfoCount"
      :category-count="categories.length"
      :total-sub-count="totalSubCount"
      :loading="loading"
      @open-region="openRegionPicker"
      @search="goSearch"
    />

    <view class="page-home__body">
      <HomeQuickActions
        @publish="goPublish"
        @ai="goAi"
        @category="goCategoryTab"
        @search="goSearch"
      />

      <HomePromoSection
        :loading="loading"
        :banners="banners"
        :notices="notices"
        @notice-click="goNotice"
      />

      <HomeCategoriesSection
        :loading="loading"
        :categories="homeCategories"
        @view-all="goCategoryTab"
        @select="onCategorySelect"
      />

      <HomeRecommendSection
        :loading="loading"
        :total-count="totalInfoCount"
        :featured="featuredInfo"
        :grid-list="gridInfoList"
        :has-more="infoList.length > 0"
        @view-all="goList"
        @detail="goDetail"
      />
    </view>

    <AppTabBar page-path="pages/home/index" />

    <RegionPickerPopup
      v-model:show="regionPickerShow"
      :province="locationStore.province"
      :city="locationStore.city"
      :district="locationStore.district"
      @confirm="onRegionConfirm"
    />
  </view>
</template>

<script setup lang="ts">
import AppTabBar from '@/components/AppTabBar/AppTabBar.vue';
import HomeQuickActions from '@/components/HomeQuickActions/HomeQuickActions.vue';
import RegionPickerPopup from '@/components/RegionPickerPopup/RegionPickerPopup.vue';
import { useTabBarPage } from '@/composables/useTabBarPage';
import { useSafeAreaInsets } from '@/composables/useSafeAreaInsets';
import HomeCategoriesSection from './components/HomeCategoriesSection.vue';
import HomeHero from './components/HomeHero.vue';
import HomePromoSection from './components/HomePromoSection.vue';
import HomeRecommendSection from './components/HomeRecommendSection.vue';
import { useHomePage } from './composables/useHomePage';

useTabBarPage();
const { pageStyle } = useSafeAreaInsets();

const {
  locationStore,
  banners,
  notices,
  categories,
  homeCategories,
  totalInfoCount,
  totalSubCount,
  featuredInfo,
  gridInfoList,
  infoList,
  loading,
  regionPickerShow,
  openRegionPicker,
  onRegionConfirm,
  goSearch,
  goPublish,
  goAi,
  goCategoryTab,
  goNotice,
  onCategorySelect,
  goList,
  goDetail,
} = useHomePage();
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.page-home {
  min-height: 100vh;
  @include cv-page-ambient;
}

.page-home__body {
  @include cv-body-sheet;
}
</style>
