<template>
  <view v-if="items.length" class="ai-info-cards">
    <text class="ai-info-cards__label">相关同城信息</text>
    <view
      v-for="item in items"
      :key="item.id"
      class="ai-info-cards__item"
      @click.stop="emit('select', item)"
    >
      <ArtImageCover
        class="ai-info-cards__thumb"
        :src="item.images?.[0]"
        :seed="item.id"
        image-class="ai-info-cards__thumb-img"
      />
      <view class="ai-info-cards__main">
        <text v-if="item.categoryName" class="ai-info-cards__cat">{{ item.categoryName }}</text>
        <text class="ai-info-cards__title">{{ item.title }}</text>
        <view class="ai-info-cards__meta">
          <text class="ai-info-cards__price">{{ formatPrice(item.price) }}</text>
          <text v-if="item.address" class="ai-info-cards__addr">{{ item.address }}</text>
        </view>
      </view>
      <u-icon name="arrow-right" color="#cbd5e1" size="12" />
    </view>
  </view>
</template>

<script setup lang="ts">
import ArtImageCover from '@/components/ArtImageCover/ArtImageCover.vue';
import type { CityInfoItem } from '@/types/city-info';
import { formatPrice } from '@/utils/format';

defineProps<{
  items: CityInfoItem[];
}>();

const emit = defineEmits<{
  select: [item: CityInfoItem];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.ai-info-cards {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-top: 8rpx;
  width: 100%;
}

.ai-info-cards__label {
  font-size: 22rpx;
  font-weight: 600;
  color: $cv-text-secondary;
}

.ai-info-cards__item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  border-radius: $cv-radius-sm;
  background: $cv-surface;
  border: 1rpx solid $cv-border;
  @include cv-pressable;
}

.ai-info-cards__thumb {
  width: 96rpx;
  height: 96rpx;
  border-radius: 14rpx;
  flex-shrink: 0;
  overflow: hidden;
}

:deep(.ai-info-cards__thumb-img) {
  width: 100%;
  height: 100%;
}

.ai-info-cards__main {
  flex: 1;
  min-width: 0;
}

.ai-info-cards__cat {
  display: inline-block;
  padding: 2rpx 10rpx;
  margin-bottom: 6rpx;
  border-radius: $cv-radius-pill;
  font-size: 18rpx;
  font-weight: 600;
  color: $cv-primary;
  background: $cv-primary-soft;
}

.ai-info-cards__title {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: $cv-text;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ai-info-cards__meta {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 6rpx;
}

.ai-info-cards__price {
  font-size: 24rpx;
  font-weight: 700;
  color: $cv-accent;
  flex-shrink: 0;
}

.ai-info-cards__addr {
  flex: 1;
  min-width: 0;
  font-size: 20rpx;
  color: $cv-text-muted;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
