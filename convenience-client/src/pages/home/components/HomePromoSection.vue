<template>
  <view v-if="loading" class="home-promo">
    <SkeletonBlock height="280rpx" radius="20rpx" :shimmer="true" />
    <view class="home-promo__notice-sk cv-card">
      <SkeletonLine variant="short" />
      <SkeletonLine variant="long" height="28rpx" />
      <SkeletonLine variant="mid" />
    </view>
  </view>
  <view v-else-if="banners.length || notices.length" class="home-promo">
    <view v-if="banners.length" class="home-promo__swiper-wrap cv-card">
      <swiper
        class="home-promo__swiper"
        circular
        indicator-dots
        indicator-color="rgba(255,255,255,0.35)"
        :indicator-active-color="primaryColor"
        autoplay
        :interval="4500"
      >
        <swiper-item v-for="banner in banners" :key="banner.id">
          <ArtImageCover
            class="home-promo__banner-cover"
            :src="banner.imageUrl"
            :seed="`banner-${banner.id}`"
            image-class="home-promo__banner-img"
          />
        </swiper-item>
      </swiper>
    </view>
    <view v-if="notices.length" class="home-promo__notice cv-card" @click="emit('noticeClick', notices[0].id)">
      <view class="home-promo__notice-head">
        <view class="home-promo__notice-tag">公告</view>
        <text class="home-promo__notice-time">{{ formatNoticeDate(notices[0].createdAt) }}</text>
      </view>
      <text class="home-promo__notice-text">{{ notices[0].title }}</text>
      <view class="home-promo__notice-go">
        <text>查看详情</text>
        <u-icon name="arrow-right" color="#1d4ed8" size="12" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import ArtImageCover from '@/components/ArtImageCover/ArtImageCover.vue';
import SkeletonBlock from '@/components/SkeletonBlock/SkeletonBlock.vue';
import SkeletonLine from '@/components/SkeletonLine/SkeletonLine.vue';
import type { BannerItem, NoticeItem } from '@/types/city-info';

defineProps<{
  loading: boolean;
  banners: BannerItem[];
  notices: NoticeItem[];
}>();

const emit = defineEmits<{
  noticeClick: [id: number];
}>();

const primaryColor = '#1d4ed8';

function formatNoticeDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.home-promo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 8rpx;
}

.home-promo__swiper-wrap {
  overflow: hidden;
  padding: 10rpx;
}

.home-promo__swiper {
  width: 100%;
  height: 280rpx;
  border-radius: 20rpx;
  overflow: hidden;
}

.home-promo__banner-cover {
  width: 100%;
  height: 280rpx;
}

:deep(.home-promo__banner-img) {
  width: 100%;
  height: 280rpx;
}

.home-promo__notice {
  padding: 24rpx 26rpx;
  @include cv-pressable;
}

.home-promo__notice-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.home-promo__notice-tag {
  padding: 6rpx 14rpx;
  font-size: 22rpx;
  font-weight: 600;
  color: $cv-accent;
  background: $cv-accent-soft;
  border-radius: $cv-radius-sm;
}

.home-promo__notice-time {
  font-size: 22rpx;
  color: $cv-text-muted;
  font-variant-numeric: tabular-nums;
}

.home-promo__notice-text {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $cv-text;
  line-height: 1.45;
  letter-spacing: -0.02em;
}

.home-promo__notice-go {
  display: flex;
  align-items: center;
  gap: 6rpx;
  margin-top: 16rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: $cv-primary;
}

.home-promo__notice-sk {
  padding: 24rpx 26rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
