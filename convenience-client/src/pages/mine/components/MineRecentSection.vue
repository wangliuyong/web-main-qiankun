<template>
  <view class="mine-recent">
    <view class="mine-recent__head">
      <text class="mine-recent__title">最近动态</text>
    </view>

    <view v-if="collects.length" class="mine-recent__block cv-card">
      <view class="mine-recent__label">
        <u-icon name="star-fill" color="#1d4ed8" size="14" />
        <text>最近收藏</text>
      </view>
      <view
        v-for="item in collects"
        :key="`c-${item.id}`"
        class="mine-recent__item"
        @click="emit('detail', item)"
      >
        <ArtImageCover
          class="mine-recent__thumb"
          :src="item.images?.[0]"
          :seed="item.id"
          image-class="mine-recent__thumb-img"
        />
        <view class="mine-recent__main">
          <text class="mine-recent__name">{{ item.title }}</text>
          <text class="mine-recent__sub">
            {{ formatPrice(item.price) }} · {{ formatRelativeTime(item.createdAt) }}
          </text>
        </view>
        <u-icon name="arrow-right" color="#cbd5e1" size="12" />
      </view>
    </view>

    <view v-if="posts.length" class="mine-recent__block cv-card">
      <view class="mine-recent__label">
        <u-icon name="file-text-fill" color="#1d4ed8" size="14" />
        <text>最近发布</text>
      </view>
      <view
        v-for="item in posts"
        :key="`p-${item.id}`"
        class="mine-recent__item"
        @click="emit('detail', item)"
      >
        <ArtImageCover
          class="mine-recent__thumb"
          :src="item.images?.[0]"
          :seed="item.id"
          image-class="mine-recent__thumb-img"
        />
        <view class="mine-recent__main">
          <text class="mine-recent__name">{{ item.title }}</text>
          <view class="mine-recent__sub-row">
            <text class="mine-recent__sub">{{ formatRelativeTime(item.createdAt) }}</text>
            <text
              class="mine-recent__audit-tag"
              :class="`mine-recent__audit-tag--${item.auditStatus.toLowerCase()}`"
            >
              {{ AUDIT_STATUS_LABEL[item.auditStatus] }}
            </text>
          </view>
        </view>
        <u-icon name="arrow-right" color="#cbd5e1" size="12" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import ArtImageCover from '@/components/ArtImageCover/ArtImageCover.vue';
import type { CityInfoItem } from '@/types/city-info';
import { AUDIT_STATUS_LABEL, formatPrice, formatRelativeTime } from '@/utils/format';

defineProps<{
  collects: CityInfoItem[];
  posts: CityInfoItem[];
}>();

const emit = defineEmits<{
  detail: [item: CityInfoItem];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.mine-recent {
  margin-top: 32rpx;
}

.mine-recent__head {
  margin-bottom: 16rpx;
}

.mine-recent__title {
  font-size: 30rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.03em;
}

.mine-recent__block {
  padding: 8rpx 0;
  margin-bottom: 16rpx;
  overflow: hidden;
}

.mine-recent__label {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 20rpx 28rpx 12rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: $cv-text-secondary;
}

.mine-recent__item {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 18rpx 28rpx;
  @include cv-pressable;

  &:not(:last-child) {
    border-bottom: 1rpx solid $cv-border;
  }
}

.mine-recent__thumb {
  width: 88rpx;
  height: 88rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
  overflow: hidden;
}

:deep(.mine-recent__thumb-img) {
  width: 100%;
  height: 100%;
}

.mine-recent__main {
  flex: 1;
  min-width: 0;
}

.mine-recent__name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $cv-text;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mine-recent__sub {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: $cv-text-muted;
}

.mine-recent__sub-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 6rpx;
}

.mine-recent__audit-tag {
  padding: 2rpx 12rpx;
  border-radius: $cv-radius-pill;
  font-size: 20rpx;
  font-weight: 600;

  &--pending {
    color: $cv-accent;
    background: $cv-accent-soft;
  }

  &--approved {
    color: #15803d;
    background: #f0fdf4;
  }

  &--rejected {
    color: #dc2626;
    background: #fef2f2;
  }
}
</style>
