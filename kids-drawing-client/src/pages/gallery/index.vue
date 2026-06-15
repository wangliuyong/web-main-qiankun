<template>
  <view class="page-root">
    <view class="safe-top" :style="{ height: statusBarHeight + 'px' }" />
    <view class="gallery-header">
      <text class="header-title">我的作品 🖼️</text>
      <text class="work-count">共 {{ kidsStore.workCount }} 幅</text>
    </view>

    <scroll-view v-if="works.length > 0" class="gallery-scroll" scroll-y>
      <view class="gallery-grid">
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
      <text class="empty-hint">完成课时或自由创作后保存吧！</text>
      <view class="empty-btn" @click="goStudio">
        <text class="empty-btn-text">去画画 →</text>
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
  padding: 12px 16px;
  background-color: #ffd166;
  border-bottom: 3px solid #2d3436;
}

.header-title {
  font-size: 20px;
  font-weight: bold;
  color: #2d3436;
  display: block;
}

.work-count {
  font-size: 14px;
  color: #636e72;
  margin-top: 4px;
  display: block;
}

.gallery-scroll {
  flex: 1;
  height: 0;
}

.gallery-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 12px;
  justify-content: space-between;
}

.work-card {
  width: 46%;
  background-color: #ffffff;
  border-radius: 12px;
  border: 2px solid #2d3436;
  margin-bottom: 12px;
  overflow: hidden;
  box-sizing: border-box;
}

.work-thumb {
  width: 100%;
  height: 140px;
  background-color: #f0f0f0;
}

.work-title {
  font-size: 13px;
  font-weight: bold;
  color: #2d3436;
  padding: 6px 8px 0;
  display: block;
}

.work-date {
  font-size: 11px;
  color: #636e72;
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

.empty-icon { font-size: 64px; }
.empty-text {
  font-size: 18px;
  font-weight: bold;
  color: #2d3436;
  margin-top: 12px;
}
.empty-hint {
  font-size: 14px;
  color: #636e72;
  margin-top: 8px;
}

.empty-btn {
  background-color: #7ae582;
  border-radius: 20px;
  padding: 12px 24px;
  margin-top: 20px;
  border: 2px solid #2d3436;
}

.empty-btn-text {
  font-size: 16px;
  font-weight: bold;
  color: #2d3436;
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
  width: 300px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-image {
  width: 260px;
  height: 260px;
  border-radius: 8px;
}

.preview-title {
  font-size: 16px;
  font-weight: bold;
  color: #2d3436;
  margin-top: 12px;
}

.preview-close {
  background-color: #ffd166;
  border-radius: 16px;
  padding: 8px 24px;
  margin-top: 12px;
}

.preview-close-text {
  font-size: 14px;
  color: #2d3436;
}
</style>
