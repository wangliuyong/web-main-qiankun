<template>
  <view class="home-hero">
    <view class="home-hero__orb home-hero__orb--1" />
    <view class="home-hero__orb home-hero__orb--2" />
    <view class="home-hero__head">
      <text class="home-hero__greeting">发现身边的便民信息</text>
      <view class="home-hero__location" @tap.stop="emit('openRegion')" @click.stop="emit('openRegion')">
        <view class="home-hero__location-icon">
          <u-icon name="map-fill" color="#fff" size="14" />
        </view>
        <text class="home-hero__city">{{ cityName }}</text>
        <u-icon name="arrow-down-fill" color="rgba(255,255,255,0.7)" size="10" />
      </view>
    </view>
    <text class="home-hero__sub">二手、招聘、上门服务，一站浏览</text>
    <view class="home-hero__search" @click="emit('search')">
      <u-icon name="search" color="#8b9bb8" size="18" />
      <text class="home-hero__search-ph">搜索关键词</text>
    </view>

    <view v-if="!loading" class="home-hero__stats">
      <view class="home-hero__stat">
        <text class="home-hero__stat-num">{{ totalInfoCount }}</text>
        <text class="home-hero__stat-label">条信息</text>
      </view>
      <view class="home-hero__stat-line" />
      <view class="home-hero__stat">
        <text class="home-hero__stat-num">{{ categoryCount }}</text>
        <text class="home-hero__stat-label">个大类</text>
      </view>
      <view class="home-hero__stat-line" />
      <view class="home-hero__stat">
        <text class="home-hero__stat-num">{{ totalSubCount }}</text>
        <text class="home-hero__stat-label">个子类</text>
      </view>
    </view>
    <view v-else class="home-hero__stats home-hero__stats--skeleton">
      <view v-for="i in 3" :key="i" class="home-hero__stat-sk" />
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  cityName: string;
  totalInfoCount: number;
  categoryCount: number;
  totalSubCount: number;
  loading: boolean;
}>();

const emit = defineEmits<{
  openRegion: [];
  search: [];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.home-hero {
  position: relative;
  overflow: hidden;
  @include cv-hero-bg;
  @include cv-hero-fade-bottom;
  padding: 28rpx $cv-space-page 44rpx;
  @include cv-safe-area-top(28rpx);
}

.home-hero__orb--1 {
  @include cv-hero-orb(340rpx, -80rpx, -70rpx);
}

.home-hero__orb--2 {
  position: absolute;
  width: 160rpx;
  height: 160rpx;
  left: -30rpx;
  bottom: 40rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
}

.home-hero__head {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.home-hero__location {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 10rpx;
  padding: 12rpx 20rpx 12rpx 14rpx;
  background: rgba(255, 255, 255, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.18);
  border-radius: $cv-radius-pill;
  backdrop-filter: blur(12px);
  cursor: pointer;
  @include cv-pressable;
}

.home-hero__location-icon {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-hero__city {
  font-size: 26rpx;
  color: #fff;
  font-weight: 600;
  letter-spacing: -0.01em;
  max-width: 160rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-hero__greeting {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.04em;
  line-height: 1.18;
}

.home-hero__sub {
  position: relative;
  z-index: 1;
  display: block;
  margin-top: 12rpx;
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.45;
}

.home-hero__search {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-top: 28rpx;
  padding: 24rpx 28rpx;
  border-radius: $cv-radius-pill;
  @include cv-glass;
  @include cv-pressable;
}

.home-hero__search-ph {
  flex: 1;
  font-size: 28rpx;
  color: $cv-text-muted;
}

.home-hero__stats {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24rpx;
  padding: 20rpx 28rpx;
  border-radius: $cv-radius-sm;
  background: rgba(255, 255, 255, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.16);
}

.home-hero__stats--skeleton {
  gap: 16rpx;
}

.home-hero__stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.home-hero__stat-num {
  font-size: 34rpx;
  font-weight: 700;
  color: #fff;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.04em;
  line-height: 1;
}

.home-hero__stat-label {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.72);
}

.home-hero__stat-line {
  width: 1rpx;
  height: 36rpx;
  background: rgba(255, 255, 255, 0.18);
  flex-shrink: 0;
}

.home-hero__stat-sk {
  flex: 1;
  height: 56rpx;
  border-radius: 12rpx;
  background: rgba(255, 255, 255, 0.08);
}
</style>
