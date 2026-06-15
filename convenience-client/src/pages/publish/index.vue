<template>
  <view class="page-publish cv-page" :style="pageStyle">
    <PublishHero
      :completion-percent="completionPercent"
      :completion-count="completionCount"
      @back="onBack"
    />

    <view class="page-publish__body">
      <PublishSkeleton v-if="pageLoading" />

      <template v-else>
        <PublishCategorySection
          :categories="categories"
          :active-root-id="activeRootId"
          :category-id="form.categoryId"
          :active-children="activeChildren"
          :category-label="categoryLabel"
          :has-error="errors.categoryId"
          @select-root="onSelectRootItem"
          @select-category="onSelectCategory"
        />

        <PublishContentSection
          v-model:title="form.title"
          v-model:content="form.content"
          :has-title-error="errors.title"
          :has-content-error="errors.content"
          @touch-field="touchField"
        />

        <PublishPriceLocationSection
          v-model:price="form.price"
          v-model:address="form.address"
          @pick-location="onPickLocation"
        />

        <PublishImagesSection
          :file-list="fileList"
          @after-read="onAfterRead"
          @delete="onDelete"
        />

        <PublishReviewNotice />
      </template>
    </view>

    <PublishSubmitBar
      :button-text="submitButtonText"
      :submitting="submitting"
      :uploading-images="uploadingImages"
      @submit="onSubmit"
    />
  </view>
</template>

<script setup lang="ts">
import { useSafeAreaInsets } from '@/composables/useSafeAreaInsets';
import PublishCategorySection from './components/PublishCategorySection.vue';
import PublishContentSection from './components/PublishContentSection.vue';
import PublishHero from './components/PublishHero.vue';
import PublishImagesSection from './components/PublishImagesSection.vue';
import PublishPriceLocationSection from './components/PublishPriceLocationSection.vue';
import PublishReviewNotice from './components/PublishReviewNotice.vue';
import PublishSkeleton from './components/PublishSkeleton.vue';
import PublishSubmitBar from './components/PublishSubmitBar.vue';
import { usePublishPage } from './composables/usePublishPage';

const { pageStyle } = useSafeAreaInsets();

const {
  pageLoading,
  categories,
  form,
  fileList,
  activeRootId,
  activeChildren,
  categoryLabel,
  errors,
  completionCount,
  completionPercent,
  submitting,
  uploadingImages,
  submitButtonText,
  onBack,
  onSelectRootItem,
  onSelectCategory,
  touchField,
  onPickLocation,
  onAfterRead,
  onDelete,
  onSubmit,
} = usePublishPage();
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.page-publish__body {
  @include cv-body-sheet;
  margin-top: -32rpx;
  padding-bottom: calc(300rpx + env(safe-area-inset-bottom));
}
</style>
