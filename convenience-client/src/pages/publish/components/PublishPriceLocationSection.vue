<template>
  <view class="publish-price-location cv-card">
    <view class="publish-price-location__head">
      <view class="publish-price-location__badge publish-price-location__badge--muted">3</view>
      <view class="publish-price-location__meta">
        <text class="publish-price-location__title">价格与位置</text>
        <text class="publish-price-location__sub">选填，有助于同城用户快速判断</text>
      </view>
    </view>

    <view class="publish-price-location__field">
      <text class="publish-price-location__field-label">价格（元）</text>
      <view class="publish-price-location__input-wrap publish-price-location__input-wrap--price">
        <text class="publish-price-location__currency">¥</text>
        <u-input
          :model-value="price"
          type="digit"
          placeholder="留空表示面议"
          border="none"
          :custom-style="inputStyle"
          @update:model-value="emit('update:price', $event)"
        />
      </view>
    </view>

    <view class="publish-price-location__field publish-price-location__field--last">
      <view class="publish-price-location__field-head">
        <text class="publish-price-location__field-label">地址</text>
        <view class="publish-price-location__loc-btn" @click="emit('pickLocation')">
          <u-icon name="map-fill" color="#1d4ed8" size="13" />
          <text>地图选点</text>
        </view>
      </view>
      <view class="publish-price-location__input-wrap">
        <u-input
          :model-value="address"
          placeholder="小区、街道或地标，便于附近的人找到"
          border="none"
          :custom-style="inputStyle"
          @update:model-value="emit('update:address', $event)"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { PUBLISH_INPUT_STYLE } from '../composables/usePublishPage';

defineProps<{
  price: string;
  address: string;
}>();

const emit = defineEmits<{
  'update:price': [value: string];
  'update:address': [value: string];
  pickLocation: [];
}>();

const inputStyle = PUBLISH_INPUT_STYLE;
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.publish-price-location {
  margin-bottom: 20rpx;
  padding: 28rpx 28rpx 32rpx;
}

.publish-price-location__head {
  display: flex;
  align-items: flex-start;
  gap: 18rpx;
  margin-bottom: 28rpx;
}

.publish-price-location__badge {
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

  &--muted {
    background: $cv-surface-muted;
    color: $cv-text-secondary;
    box-shadow: none;
    border: 1rpx solid $cv-border;
  }
}

.publish-price-location__meta {
  flex: 1;
  min-width: 0;
}

.publish-price-location__title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.03em;
}

.publish-price-location__sub {
  display: block;
  margin-top: 6rpx;
  font-size: 24rpx;
  color: $cv-text-muted;
  line-height: 1.45;
}

.publish-price-location__field {
  margin-bottom: 28rpx;

  &--last {
    margin-bottom: 0;
  }
}

.publish-price-location__field-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14rpx;
}

.publish-price-location__field-label {
  font-size: 26rpx;
  font-weight: 600;
  color: $cv-text;
}

.publish-price-location__input-wrap {
  display: flex;
  align-items: center;
  padding: 8rpx 24rpx;
  border-radius: $cv-radius-sm;
  background: $cv-surface-muted;
  border: 1rpx solid transparent;

  &--price {
    gap: 8rpx;
  }
}

.publish-price-location__currency {
  font-size: 32rpx;
  font-weight: 700;
  color: $cv-accent;
  flex-shrink: 0;
}

.publish-price-location__loc-btn {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 8rpx 16rpx;
  border-radius: $cv-radius-pill;
  background: $cv-primary-soft;
  font-size: 22rpx;
  font-weight: 600;
  color: $cv-primary;
  @include cv-pressable;
}
</style>
