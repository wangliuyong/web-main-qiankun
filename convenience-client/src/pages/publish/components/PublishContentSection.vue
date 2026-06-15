<template>
  <view
    id="publish-field-title"
    class="publish-content cv-card"
    :class="{ 'publish-content--error': hasTitleError || hasContentError }"
  >
    <view class="publish-content__head">
      <view class="publish-content__badge">2</view>
      <view class="publish-content__meta">
        <text class="publish-content__title">标题与详情</text>
        <text class="publish-content__sub">一句话概括，详情写清楚关键信息</text>
      </view>
    </view>

    <view class="publish-content__field">
      <view class="publish-content__field-head">
        <text class="publish-content__field-label" :class="{ 'publish-content__field-label--error': hasTitleError }">
          标题<text class="publish-content__required">*</text>
        </text>
        <text class="publish-content__field-count">{{ title.length }}/50</text>
      </view>
      <view class="publish-content__input-wrap" :class="{ 'publish-content__input-wrap--error': hasTitleError }">
        <u-input
          :model-value="title"
          placeholder="例如：九成新 iPad，配件齐全"
          maxlength="50"
          border="none"
          :custom-style="inputStyle"
          @update:model-value="emit('update:title', $event)"
          @blur="emit('touchField', 'title')"
        />
      </view>
      <text v-if="hasTitleError" class="publish-content__field-error">请填写标题</text>
    </view>

    <view id="publish-field-content" class="publish-content__field publish-content__field--last">
      <view class="publish-content__field-head">
        <text class="publish-content__field-label" :class="{ 'publish-content__field-label--error': hasContentError }">
          详情描述<text class="publish-content__required">*</text>
        </text>
        <text class="publish-content__field-count">{{ content.length }}/500</text>
      </view>
      <view class="publish-content__textarea-wrap" :class="{ 'publish-content__textarea-wrap--error': hasContentError }">
        <u-textarea
          :model-value="content"
          placeholder="描述成色、时间、联系方式等，信息越完整越容易成交"
          maxlength="500"
          height="220rpx"
          border="none"
          :custom-style="textareaStyle"
          @update:model-value="emit('update:content', $event)"
          @blur="emit('touchField', 'content')"
        />
      </view>
      <text v-if="hasContentError" class="publish-content__field-error">请填写详情</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { PUBLISH_INPUT_STYLE, PUBLISH_TEXTAREA_STYLE } from '../composables/usePublishPage';

defineProps<{
  title: string;
  content: string;
  hasTitleError: boolean;
  hasContentError: boolean;
}>();

const emit = defineEmits<{
  'update:title': [value: string];
  'update:content': [value: string];
  touchField: [field: 'title' | 'content'];
}>();

const inputStyle = PUBLISH_INPUT_STYLE;
const textareaStyle = PUBLISH_TEXTAREA_STYLE;
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';
@import '@/styles/mixins.scss';

.publish-content {
  margin-bottom: 20rpx;
  padding: 28rpx 28rpx 32rpx;
  border: 1rpx solid transparent;
  transition: border-color 0.2s $cv-ease-out, box-shadow 0.2s $cv-ease-out;

  &--error {
    border-color: rgba(220, 38, 38, 0.38);
    box-shadow: 0 0 0 4rpx rgba(220, 38, 38, 0.08);
  }
}

.publish-content__required {
  margin-left: 4rpx;
  color: #dc2626;
  font-weight: 700;
}

.publish-content__head {
  display: flex;
  align-items: flex-start;
  gap: 18rpx;
  margin-bottom: 28rpx;
}

.publish-content__badge {
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
}

.publish-content__meta {
  flex: 1;
  min-width: 0;
}

.publish-content__title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.03em;
}

.publish-content__sub {
  display: block;
  margin-top: 6rpx;
  font-size: 24rpx;
  color: $cv-text-muted;
  line-height: 1.45;
}

.publish-content__field {
  margin-bottom: 28rpx;

  &--last {
    margin-bottom: 0;
  }
}

.publish-content__field-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14rpx;
}

.publish-content__field-label {
  font-size: 26rpx;
  font-weight: 600;
  color: $cv-text;

  &--error {
    color: #dc2626;
  }
}

.publish-content__field-count {
  font-size: 22rpx;
  color: $cv-text-muted;
  font-variant-numeric: tabular-nums;
}

.publish-content__input-wrap {
  display: flex;
  align-items: center;
  padding: 8rpx 24rpx;
  border-radius: $cv-radius-sm;
  background: $cv-surface-muted;
  border: 1rpx solid transparent;
  transition: border-color 0.2s $cv-ease-out, background 0.2s $cv-ease-out;

  &--error {
    border-color: rgba(220, 38, 38, 0.35);
    background: #fef2f2;
  }
}

.publish-content__textarea-wrap {
  padding: 16rpx 20rpx;
  border-radius: $cv-radius-sm;
  background: $cv-surface-muted;
  border: 1rpx solid transparent;

  &--error {
    border-color: rgba(220, 38, 38, 0.35);
    background: #fef2f2;
  }
}

.publish-content__field-error {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #dc2626;
}
</style>
