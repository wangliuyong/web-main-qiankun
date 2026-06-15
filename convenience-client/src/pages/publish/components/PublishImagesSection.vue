<template>
  <view class="publish-images cv-card">
    <view class="publish-images__head">
      <view class="publish-images__badge publish-images__badge--muted">4</view>
      <view class="publish-images__meta">
        <text class="publish-images__title">添加图片</text>
        <text class="publish-images__sub">最多 6 张，校验通过后提交时上传</text>
      </view>
    </view>

    <view class="publish-images__upload">
      <u-upload
        :file-list="fileList"
        name="image"
        multiple
        :max-count="6"
        width="152rpx"
        height="152rpx"
        @after-read="emit('afterRead', $event)"
        @delete="emit('delete', $event)"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  fileList: { url: string }[];
}>();

const emit = defineEmits<{
  afterRead: [event: {
    file: UniApp.UploadFileSuccessCallbackResultFile | UniApp.UploadFileSuccessCallbackResultFile[];
  }];
  delete: [event: { index: number }];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.publish-images {
  margin-bottom: 20rpx;
  padding: 28rpx 28rpx 32rpx;
}

.publish-images__head {
  display: flex;
  align-items: flex-start;
  gap: 18rpx;
  margin-bottom: 28rpx;
}

.publish-images__badge {
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

  &--muted {
    background: $cv-surface-muted;
    color: $cv-text-secondary;
    box-shadow: none;
    border: 1rpx solid $cv-border;
  }
}

.publish-images__meta {
  flex: 1;
  min-width: 0;
}

.publish-images__title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $cv-text;
  letter-spacing: -0.03em;
}

.publish-images__sub {
  display: block;
  margin-top: 6rpx;
  font-size: 24rpx;
  color: $cv-text-muted;
  line-height: 1.45;
}

.publish-images__upload {
  :deep(.u-upload) {
    flex-wrap: wrap;
  }

  :deep(.u-upload__button) {
    border-radius: $cv-radius-sm !important;
    background: $cv-surface-muted !important;
    border: 1rpx dashed rgba(11, 18, 32, 0.12) !important;
  }
}
</style>
