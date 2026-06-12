<template>
  <!--
    艺术图片封面：加载成功显示原图，无图或 @error 时展示确定性纯色几何构图
    默认插槽用于叠加标签、角标等绝对定位内容
  -->
  <view class="art-image-cover">
    <image
      v-if="showImage"
      class="art-image-cover__img"
      :class="imageClass"
      :src="src"
      :mode="mode"
      @error="onImageError"
      @load="onImageLoad"
    />
    <view
      v-else
      class="art-image-cover__fallback"
      :class="`art-image-cover__fallback--v${palette.variant}`"
      :style="fallbackStyle"
      aria-hidden="true"
    >
      <view class="art-image-cover__orb art-image-cover__orb--a" />
      <view class="art-image-cover__orb art-image-cover__orb--b" />
      <view class="art-image-cover__slash" />
    </view>
    <view v-if="$slots.default" class="art-image-cover__slot">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { resolveArtFallbackPalette } from '@/utils/image-fallback';

const props = withDefaults(
  defineProps<{
    /** 图片地址，空值直接走艺术占位 */
    src?: string | null;
    /** 稳定 seed，同一业务 id 映射同一色板 */
    seed: string | number;
    mode?: string;
    imageClass?: string;
  }>(),
  {
    src: '',
    mode: 'aspectFill',
    imageClass: '',
  },
);

const emit = defineEmits<{
  error: [];
  load: [];
}>();

/** 是否因加载失败切换为艺术占位 */
const loadFailed = ref(false);

/** 有有效 src 且未失败时展示 image */
const showImage = computed(() => Boolean(props.src) && !loadFailed.value);

/** 按 seed 解析色板，无图与失败态共用同一构图 */
const palette = computed(() => resolveArtFallbackPalette(props.seed));

/** 内联样式：渐变底 + 装饰色 CSS 变量 */
const fallbackStyle = computed(() => ({
  background: palette.value.background,
  '--art-accent-a': palette.value.accentA,
  '--art-accent-b': palette.value.accentB,
}));

/** src 变化时重置失败态，支持列表复用与轮播切换 */
watch(
  () => props.src,
  () => {
    loadFailed.value = false;
  },
);

function onImageError() {
  loadFailed.value = true;
  emit('error');
}

function onImageLoad() {
  emit('load');
}
</script>

<style lang="scss" scoped>
.art-image-cover {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.art-image-cover__img {
  display: block;
  width: 100%;
  height: 100%;
}

.art-image-cover__fallback {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/** 插槽层：标签、角标等叠在图片或占位之上 */
.art-image-cover__slot {
  position: absolute;
  inset: 0;
  pointer-events: none;

  :deep(*) {
    pointer-events: auto;
  }
}

/** 装饰圆：半透明色块营造海报感 */
.art-image-cover__orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.art-image-cover__orb--a {
  background: var(--art-accent-a);
}

.art-image-cover__orb--b {
  background: var(--art-accent-b);
}

/** 斜向光带：增加层次，避免纯色平板 */
.art-image-cover__slash {
  position: absolute;
  pointer-events: none;
  background: linear-gradient(
    105deg,
    transparent 42%,
    rgba(255, 255, 255, 0.14) 50%,
    transparent 58%
  );
}

/** 变体 0：右上大圆 + 左下小圆 */
.art-image-cover__fallback--v0 {
  .art-image-cover__orb--a {
    width: 72%;
    height: 72%;
    top: -22%;
    right: -18%;
  }

  .art-image-cover__orb--b {
    width: 38%;
    height: 38%;
    left: -10%;
    bottom: -8%;
  }

  .art-image-cover__slash {
    inset: 0;
    transform: rotate(-8deg) scale(1.4);
    opacity: 0.55;
  }
}

/** 变体 1：左下椭圆 + 右上光点 */
.art-image-cover__fallback--v1 {
  .art-image-cover__orb--a {
    width: 85%;
    height: 55%;
    left: -28%;
    bottom: -18%;
    border-radius: 48%;
  }

  .art-image-cover__orb--b {
    width: 28%;
    height: 28%;
    top: 14%;
    right: 12%;
  }

  .art-image-cover__slash {
    width: 140%;
    height: 36%;
    top: 38%;
    left: -20%;
    transform: rotate(12deg);
    opacity: 0.45;
  }
}

/** 变体 2：居中偏右圆 + 底部色带 */
.art-image-cover__fallback--v2 {
  .art-image-cover__orb--a {
    width: 58%;
    height: 58%;
    top: 18%;
    right: -12%;
  }

  .art-image-cover__orb--b {
    width: 100%;
    height: 32%;
    left: 0;
    bottom: 0;
    border-radius: 0;
    background: linear-gradient(180deg, transparent 0%, var(--art-accent-b) 100%);
  }

  .art-image-cover__slash {
    width: 3rpx;
    height: 120%;
    top: -10%;
    left: 32%;
    transform: rotate(18deg);
    background: rgba(255, 255, 255, 0.16);
    opacity: 0.7;
  }
}
</style>
