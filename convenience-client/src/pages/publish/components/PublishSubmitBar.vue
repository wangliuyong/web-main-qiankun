<template>
  <view class="publish-submit cv-bottom-bar">
    <view class="publish-submit__wrap">
      <u-button
        type="primary"
        :text="buttonText"
        shape="circle"
        :loading="submitting || uploadingImages"
        :disabled="submitting || uploadingImages"
        @click="emit('submit')"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  buttonText: string;
  submitting: boolean;
  uploadingImages: boolean;
}>();

const emit = defineEmits<{
  submit: [];
}>();
</script>

<style lang="scss" scoped>
@import '@/styles/tokens.scss';

.publish-submit {
  padding-top: 16rpx;
}

.publish-submit__wrap {
  :deep(.u-button) {
    border-radius: $cv-radius-pill;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  :deep(.u-button--disabled) {
    opacity: 0.72;
  }
}
</style>
