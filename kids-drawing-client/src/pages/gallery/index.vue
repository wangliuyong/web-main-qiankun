<template>
  <view class="page-root">
    <view class="page-body">
      <view class="safe-top" :style="{ height: statusBarHeight + 'px' }" />
      <view class="gallery-header">
        <text class="header-title">我的作品</text>
        <text class="work-count">共 {{ kidsStore.workCount }} 幅</text>
      </view>

      <scroll-view v-if="works.length > 0" class="gallery-scroll" scroll-y>
        <view class="page-content gallery-grid">
          <view
            v-for="work in works"
            :key="work.id"
            class="work-card"
            @click="onPreview(work)"
            @longpress="onDelete(work)"
          >
            <image class="work-thumb" :src="work.thumbnail" mode="aspectFill" />
            <text class="work-title">{{ work.lessonTitle }}</text>
            <text class="work-date">{{ formatDate(work.createdAt) }}</text>
          </view>
        </view>
      </scroll-view>

      <view v-else class="empty-wrap">
        <text class="empty-icon">🎨</text>
        <text class="empty-text">还没有作品哦</text>
        <text class="empty-hint">完成课时或自由创作后保存吧</text>
        <view class="empty-btn" @click="goStudio">
          <text class="empty-btn-text">去画画</text>
        </view>
      </view>

      <view v-if="previewWork" class="preview-mask" @click="closePreview">
        <view class="preview-card" @click.stop>
          <image class="preview-image" :src="previewWork.thumbnail" mode="aspectFit" />
          <text class="preview-title">{{ previewWork.lessonTitle }}</text>
          <view class="preview-close" @click="closePreview">
            <text class="preview-close-text">关闭</text>
          </view>
        </view>
      </view>
    </view>

    <KidTabBar :current="2" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import KidTabBar from '@/components/KidTabBar/KidTabBar.vue';
import { useKidsStore } from '@/stores/kids';
import type { GalleryWork } from '@/types/gallery';

const kidsStore = useKidsStore();
const statusBarHeight = ref(0);
const previewWork = ref<GalleryWork | null>(null);

const works = computed(() => kidsStore.gallery.works);

function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function onPreview(work: GalleryWork): void {
  previewWork.value = work;
}

function closePreview(): void {
  previewWork.value = null;
}

function onDelete(work: GalleryWork): void {
  uni.showModal({
    title: '删除作品',
    content: '确定删除这幅作品吗？',
    success: (res) => {
      if (res.confirm) {
        kidsStore.postRemoveWork(work.id);
        uni.showToast({ title: '已删除', icon: 'none' });
      }
    },
  });
}

function goStudio(): void {
  uni.redirectTo({ url: '/pages/studio/index' });
}

onLoad(() => {
  kidsStore.setTabIndex(2);
  statusBarHeight.value = uni.getSystemInfoSync().statusBarHeight || 0;
});
</script>

<style lang="scss" scoped>
.gallery-header {
  @include kd-top-bar;
  flex-direction: column;
  align-items: flex-start;
}

.header-title {
  font-size: $kd-text-xl;
  font-weight: bold;
  color: $kd-ink;
}

.work-count {
  font-size: $kd-text-sm;
  color: $kd-ink-muted;
  margin-top: 4px;
}

.gallery-scroll {
  flex: 1;
  height: 0;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $kd-space-sm;
  padding-top: $kd-space-sm;
  padding-bottom: $kd-space-lg;

  @include kd-tablet {
    grid-template-columns: repeat(3, 1fr);
  }

  @include kd-landscape {
    grid-template-columns: repeat(4, 1fr);
    gap: $kd-space-md;
  }
}

.work-card {
  @include kd-card;
  border-width: 2px;
  overflow: hidden;
  padding: 0;

  &:active {
    transform: scale(0.98);
  }
}

.work-thumb {
  width: 100%;
  height: 140px;
  background-color: #f0f0f0;

  @include kd-landscape {
    height: 180px;
  }
}

.work-title {
  font-size: $kd-text-sm;
  font-weight: bold;
  color: $kd-ink;
  padding: 6px 8px 0;
  display: block;
}

.work-date {
  font-size: $kd-text-xs;
  color: $kd-ink-muted;
  padding: 2px 8px 8px;
  display: block;
}

.empty-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.empty-icon {
  font-size: 64px;
}

.empty-text {
  font-size: $kd-text-lg;
  font-weight: bold;
  color: $kd-ink;
  margin-top: $kd-space-sm;
}

.empty-hint {
  font-size: $kd-text-sm;
  color: $kd-ink-muted;
  margin-top: $kd-space-xs;
}

.empty-btn {
  background-color: $kd-green;
  border-radius: $kd-radius-lg;
  padding: $kd-space-sm $kd-space-lg;
  margin-top: $kd-space-lg;
  border: 2px solid $kd-border-color;
  @include kd-touch-target;

  &:active {
    transform: scale(0.98);
  }
}

.empty-btn-text {
  font-size: $kd-text-base;
  font-weight: bold;
  color: $kd-ink;
}

.preview-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.preview-card {
  width: min(90vw, 480px);
  background-color: $kd-surface;
  border-radius: $kd-radius-md;
  padding: $kd-space-md;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: $kd-border-width solid $kd-border-color;
}

.preview-image {
  width: 100%;
  max-width: 420px;
  height: min(60vh, 420px);
  border-radius: $kd-radius-sm;
}

.preview-title {
  font-size: $kd-text-base;
  font-weight: bold;
  color: $kd-ink;
  margin-top: $kd-space-sm;
}

.preview-close {
  background: linear-gradient(135deg, $kd-pink 0%, $kd-lavender 100%);
  border-radius: $kd-radius-md;
  padding: 8px 24px;
  margin-top: $kd-space-sm;
  border: 2px solid $kd-border-color;
  @include kd-touch-target;

  &:active {
    transform: scale(0.98);
  }
}

.preview-close-text {
  font-size: $kd-text-sm;
  color: $kd-ink;
  font-weight: 600;
}
</style>
