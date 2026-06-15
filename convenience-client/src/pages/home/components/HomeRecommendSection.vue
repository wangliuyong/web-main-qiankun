<template>
  <view class="cv-section">
    <SectionHead title="最新推荐" :action-text="`共 ${totalCount} 条`" @action="emit('viewAll')" />
    <view v-if="loading" class="home-recommend__sk">
      <SkeletonBlock height="320rpx" radius="20rpx" :shimmer="true" />
      <view class="home-recommend__grid-sk">
        <SkeletonBlock v-for="i in 6" :key="i" height="280rpx" radius="16rpx" :shimmer="true" />
      </view>
    </view>
    <template v-else>
      <HomeFeaturedCard v-if="featured" :item="featured" @click="emit('detail', $event)" />
      <view v-if="gridList.length" class="home-recommend__grid">
        <HomeInfoTile v-for="item in gridList" :key="item.id" :item="item" @click="emit('detail', $event)" />
      </view>
      <u-empty v-if="!featured && !gridList.length" mode="list" text="暂无推荐信息" />
      <view v-if="hasMore" class="home-recommend__more" @click="emit('viewAll')">
        <text>查看更多同城信息</text>
        <u-icon name="arrow-right" color="#1d4ed8" size="14" />
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import HomeFeaturedCard from '@/components/HomeFeaturedCard/HomeFeaturedCard.vue';
import HomeInfoTile from '@/components/HomeInfoTile/HomeInfoTile.vue';
import SectionHead from '@/components/SectionHead/SectionHead.vue';
import SkeletonBlock from '@/components/SkeletonBlock/SkeletonBlock.vue';
import type { CityInfoItem } from '@/types/city-info';

defineProps<{
  loading: boolean;
  totalCount: number;
  featured: CityInfoItem | null;
  gridList: CityInfoItem[];
  hasMore: boolean;
}>();

const emit = defineEmits<{
  viewAll: [];
  detail: [item: CityInfoItem];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.home-recommend__sk {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.home-recommend__grid-sk {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

.home-recommend__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14rpx;
}

.home-recommend__more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin-top: 24rpx;
  padding: 24rpx;
  border-radius: $cv-radius-pill;
  background: $cv-surface;
  border: 1rpx solid $cv-border;
  font-size: 28rpx;
  font-weight: 600;
  color: $cv-primary;
  @include cv-pressable;
}
</style>
