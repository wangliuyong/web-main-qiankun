<template>
  <view class="mine-logout">
    <u-button type="error" plain text="退出登录" shape="circle" @click="emit('logout')" />
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  logout: [];
}>();
</script>

<style lang="scss" scoped>
.mine-logout {
  margin-top: 32rpx;
  padding-bottom: 16rpx;
}
</style>
