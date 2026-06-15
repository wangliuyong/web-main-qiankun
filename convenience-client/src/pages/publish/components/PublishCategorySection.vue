<template>
  <view
    id="publish-field-category"
    class="publish-category cv-card"
    :class="{ 'publish-category--error': hasError }"
  >
    <view class="publish-category__head">
      <view class="publish-category__badge" :class="{ 'publish-category__badge--error': hasError }">
        1
      </view>
      <view class="publish-category__meta">
        <text class="publish-category__title" :class="{ 'publish-category__title--error': hasError }">
          选择分类<text class="publish-category__required">*</text>
        </text>
        <text class="publish-category__sub">先选大类，再点具体类型</text>
      </view>
      <text v-if="hasError" class="publish-category__tip">请选择</text>
    </view>

    <CategoryRootStrip
      :list="categories"
      :active-id="activeRootId"
      layout="wrap"
      :show-hint="false"
      :class="{ 'publish-category__strip--error': hasError }"
      @select="emit('selectRoot', $event)"
    />

    <scroll-view
      v-if="activeChildren.length"
      scroll-x
      enable-flex
      class="publish-category__chips-scroll"
      :show-scrollbar="false"
    >
      <view class="publish-category__chips">
        <view
          v-for="child in activeChildren"
          :key="child.id"
          class="publish-category__chip"
          :class="{ 'publish-category__chip--active': categoryId === child.id }"
          @click="emit('selectCategory', child.id)"
        >
          {{ child.name }}
        </view>
      </view>
    </scroll-view>

    <text v-if="hasError" class="publish-category__error publish-category__error--block">
      请选择具体分类后再提交
    </text>

    <view v-if="categoryLabel" class="publish-category__picked">
      <view class="publish-category__picked-icon">
        <u-icon name="checkmark-circle-fill" color="#1d4ed8" size="16" />
      </view>
      <view class="publish-category__picked-text">
        <text class="publish-category__picked-label">已选分类</text>
        <text class="publish-category__picked-value">{{ categoryLabel }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import CategoryRootStrip from '@/components/CategoryRootStrip/CategoryRootStrip.vue';
import type { CategoryItem } from '@/types/city-info';

defineProps<{
  categories: CategoryItem[];
  activeRootId: number;
  categoryId: number;
  activeChildren: CategoryItem[];
  categoryLabel: string;
  hasError: boolean;
}>();

const emit = defineEmits<{
  selectRoot: [item: CategoryItem];
  selectCategory: [id: number];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.publish-category {
  margin-bottom: 20rpx;
  padding: 28rpx 28rpx 32rpx;
  border: 1rpx solid transparent;
  transition: border-color 0.2s $cv-ease-out, box-shadow 0.2s $cv-ease-out;

  &--error {
    border-color: rgba(220, 38, 38, 0.38);
    box-shadow: 0 0 0 4rpx rgba(220, 38, 38, 0.08);
  }
}

.publish-category__required {
  margin-left: 4rpx;
  color: #dc2626;
  font-weight: 700;
}

.publish-category__head {
  display: flex;
  align-items: flex-start;
  gap: 18rpx;
  margin-bottom: 28rpx;
}

.publish-category__badge {
  width: 44rpx;
  height: 44rpx;
  border-radius: 14rpx;
  background: linear-gradient(155deg, $cv-hero-ink 0%, $cv-primary 100%);
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8rpx 20rpx rgba(29, 78, 216, 0.28);

  &--error {
    background: linear-gradient(155deg, #b91c1c 0%, #dc2626 100%);
    box-shadow: 0 8rpx 20rpx rgba(220, 38, 38, 0.24);
  }
}

.publish-category__title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.03em;

  &--error {
    color: #dc2626;
  }
}

.publish-category__meta {
  flex: 1;
  min-width: 0;
}

.publish-category__sub {
  display: block;
  margin-top: 6rpx;
  font-size: 24rpx;
  color: $cv-text-muted;
  line-height: 1.45;
}

.publish-category__tip {
  font-size: 22rpx;
  font-weight: 600;
  flex-shrink: 0;
  padding-top: 6rpx;
  color: #dc2626;
}

.publish-category__strip--error {
  padding: 12rpx;
  margin: -12rpx;
  border-radius: $cv-radius-sm;
  background: #fef2f2;
  border: 1rpx solid rgba(220, 38, 38, 0.28);
}

.publish-category__chips-scroll {
  width: 100%;
  height: 80rpx;
  margin-top: 20rpx;
  white-space: nowrap;
}

.publish-category__chips {
  display: inline-flex;
  align-items: center;
  height: 80rpx;
  gap: 12rpx;
  padding: 0 4rpx;
  box-sizing: border-box;
}

.publish-category__chip {
  display: inline-flex;
  align-items: center;
  padding: 14rpx 28rpx;
  border-radius: $cv-radius-pill;
  font-size: 26rpx;
  font-weight: 500;
  color: $cv-text-secondary;
  background: $cv-surface-muted;
  border: 1rpx solid $cv-border;
  flex-shrink: 0;
  @include cv-pressable;

  &--active {
    color: $cv-primary;
    background: $cv-primary-soft;
    border-color: rgba(29, 78, 216, 0.22);
    font-weight: 600;
  }
}

.publish-category__error {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #dc2626;

  &--block {
    margin-top: 16rpx;
  }
}

.publish-category__picked {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-top: 20rpx;
  padding: 18rpx 20rpx;
  border-radius: $cv-radius-sm;
  background: linear-gradient(135deg, rgba(29, 78, 216, 0.06) 0%, rgba(29, 78, 216, 0.12) 100%);
  border: 1rpx solid rgba(29, 78, 216, 0.14);
}

.publish-category__picked-icon {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.publish-category__picked-text {
  flex: 1;
  min-width: 0;
}

.publish-category__picked-label {
  display: block;
  font-size: 20rpx;
  color: $cv-text-muted;
  line-height: 1.3;
}

.publish-category__picked-value {
  display: block;
  margin-top: 4rpx;
  font-size: 26rpx;
  font-weight: 700;
  color: $cv-primary-dark;
  letter-spacing: -0.02em;
}
</style>
