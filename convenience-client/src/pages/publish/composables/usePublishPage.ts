import { ref, computed, onMounted, nextTick } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { postUploadImage } from '@/api/ai.api';
import { postCityInfo } from '@/api/city-info.api';
import { queryCategoryTree } from '@/api/category.api';
import { useLocationStore } from '@/stores/location';
import { useTabBarStore } from '@/stores/tabbar';
import { useUserStore } from '@/stores/user';
import type { CategoryItem } from '@/types/city-info';

/** 发布页表单字段 */
export interface PublishForm {
  categoryId: number;
  title: string;
  content: string;
  price: string;
  address: string;
}

/** u-input / u-textarea 内嵌样式：统一灰底圆角 */
export const PUBLISH_INPUT_STYLE = {
  backgroundColor: 'transparent',
  fontSize: '28rpx',
  color: '#0b1220',
};

export const PUBLISH_TEXTAREA_STYLE = {
  backgroundColor: 'transparent',
  fontSize: '28rpx',
  color: '#0b1220',
  lineHeight: '1.6',
};

/**
 * 发布页业务逻辑：分类选择、表单校验、图片上传与提交
 * 页面 index.vue 仅负责布局编排，状态与副作用集中在此 composable
 */
export function usePublishPage() {
  const tabBarStore = useTabBarStore();
  const userStore = useUserStore();
  const locationStore = useLocationStore();

  const submitting = ref(false);
  const pageLoading = ref(true);
  const categories = ref<CategoryItem[]>([]);
  const fileList = ref<{ url: string }[]>([]);
  /** 是否正在上传待发布的图片（校验通过后） */
  const uploadingImages = ref(false);
  /** 当前展开的一级分类 ID */
  const activeRootId = ref(0);
  /** 用户是否已尝试提交，用于展示字段级错误 */
  const submitAttempted = ref(false);
  /** 已失焦校验过的字段 */
  const touched = ref({ title: false, content: false });

  const form = ref<PublishForm>({
    categoryId: 0,
    title: '',
    content: '',
    price: '',
    address: '',
  });

  /** 已选分类展示文案 */
  const categoryLabel = computed(() => {
    for (const root of categories.value) {
      const hit = (root.children || []).find((c) => c.id === form.value.categoryId);
      if (hit) return `${root.name} / ${hit.name}`;
    }
    return '';
  });

  /** 当前一级分类下的二级列表 */
  const activeChildren = computed(() => {
    const root = categories.value.find((c) => c.id === activeRootId.value);
    return root?.children || [];
  });

  /** 必填项完成数量 */
  const completionCount = computed(() => {
    let n = 0;
    if (form.value.categoryId) n += 1;
    if (form.value.title.trim()) n += 1;
    if (form.value.content.trim()) n += 1;
    return n;
  });

  /** 必填进度百分比，驱动顶部进度条 */
  const completionPercent = computed(() => Math.round((completionCount.value / 3) * 100));

  /** 是否满足提交条件 */
  const canSubmit = computed(
    () =>
      !!form.value.categoryId &&
      !!form.value.title.trim() &&
      !!form.value.content.trim(),
  );

  /** 字段级错误：仅在提交尝试或失焦后展示 */
  const errors = computed(() => ({
    categoryId: submitAttempted.value && !form.value.categoryId,
    title: (submitAttempted.value || touched.value.title) && !form.value.title.trim(),
    content: (submitAttempted.value || touched.value.content) && !form.value.content.trim(),
  }));

  /** 底部按钮文案随完成度变化 */
  const submitButtonText = computed(() => {
    if (uploadingImages.value) return '正在上传图片…';
    if (submitting.value) return '提交中…';
    return canSubmit.value ? '提交发布' : `还差 ${3 - completionCount.value} 项必填`;
  });

  /** 选中一级分类并展开二级标签 */
  function onSelectRoot(rootId: number) {
    activeRootId.value = rootId;
    const root = categories.value.find((c) => c.id === rootId);
    const children = root?.children || [];
    if (children.length === 1) {
      form.value.categoryId = children[0].id;
    } else if (!children.some((c) => c.id === form.value.categoryId)) {
      form.value.categoryId = 0;
    }
  }

  /** CategoryRootStrip 选中回调 */
  function onSelectRootItem(item: CategoryItem) {
    onSelectRoot(item.id);
  }

  /** 选中二级分类 */
  function onSelectCategory(id: number) {
    form.value.categoryId = id;
  }

  /** 根据 categoryId 反查并展开对应一级分类 */
  function syncRootFromCategory(categoryId: number) {
    if (!categoryId) return;
    for (const root of categories.value) {
      if ((root.children || []).some((c) => c.id === categoryId)) {
        activeRootId.value = root.id;
        return;
      }
    }
  }

  /** 失焦时标记字段已触摸，触发即时校验 */
  function touchField(field: 'title' | 'content') {
    touched.value[field] = true;
  }

  /** 地图选点 / 重新定位，填入地址 */
  async function onPickLocation() {
    const result = await locationStore.openLocationAction();
    if (result !== 'cancelled') {
      form.value.address = locationStore.address || locationStore.cityName;
    }
  }

  /** 选择图片：仅加入本地预览，校验通过后再上传 */
  function onAfterRead(event: {
    file: UniApp.UploadFileSuccessCallbackResultFile | UniApp.UploadFileSuccessCallbackResultFile[];
  }) {
    const files = Array.isArray(event.file) ? event.file : [event.file];
    for (const f of files) {
      const path = (f as { url?: string }).url || '';
      if (!path) continue;
      fileList.value.push({ url: path });
    }
  }

  function onDelete(event: { index: number }) {
    fileList.value.splice(event.index, 1);
  }

  /** 校验通过后批量上传本地图片，返回服务端 URL 列表 */
  async function uploadPendingImages(): Promise<string[]> {
    if (!fileList.value.length) return [];

    uploadingImages.value = true;
    const urls: string[] = [];
    try {
      for (let i = 0; i < fileList.value.length; i += 1) {
        const localPath = fileList.value[i].url;
        const res = await postUploadImage(localPath);
        urls.push(res.url);
      }
      return urls;
    } finally {
      uploadingImages.value = false;
    }
  }

  /** 发布页为独立子页，返回统一回到首页 Tab（避免 navigateBack 刷新当前页） */
  function onBack() {
    tabBarStore.activeIndex = 0;
    tabBarStore.tabBarHidden = false;
    uni.switchTab({
      url: '/pages/home/index',
      fail: () => {
        uni.reLaunch({ url: '/pages/home/index' });
      },
    });
  }

  /** 发布页隐藏原生 TabBar */
  function hideNativeTabBar() {
    // #ifdef MP-WEIXIN || APP-PLUS || H5
    uni.hideTabBar({ animation: false, fail: () => {} });
    // #endif
  }

  /** 滚动定位到第一个未填写的必填项 */
  async function scrollToFirstError() {
    await nextTick();

    let selector = '';
    if (!form.value.categoryId) {
      selector = '#publish-field-category';
    } else if (!form.value.title.trim()) {
      selector = '#publish-field-title';
    } else if (!form.value.content.trim()) {
      selector = '#publish-field-content';
    }
    if (!selector) return;

    uni.createSelectorQuery()
      .select(selector)
      .boundingClientRect()
      .selectViewport()
      .scrollOffset()
      .exec((res) => {
        const rect = res[0] as UniApp.NodeInfo | null;
        const viewport = res[1] as { scrollTop?: number } | null;
        if (!rect || rect.top === undefined || !viewport) return;

        const currentTop = viewport.scrollTop || 0;
        const targetTop = Math.max(currentTop + rect.top - 100, 0);
        uni.pageScrollTo({
          scrollTop: targetTop,
          duration: 300,
        });
      });
  }

  /** 提交发布 */
  async function onSubmit() {
    submitAttempted.value = true;
    touched.value.title = true;
    touched.value.content = true;

    if (!userStore.isLoggedIn) {
      uni.navigateTo({ url: '/pages/auth/login' });
      return;
    }
    if (!canSubmit.value) {
      uni.showToast({ title: '请完成标红的必填项', icon: 'none' });
      await scrollToFirstError();
      return;
    }

    submitting.value = true;
    try {
      let imageUrls: string[] = [];
      try {
        imageUrls = await uploadPendingImages();
      } catch (e) {
        uni.showToast({ title: (e as Error).message || '图片上传失败，请重试', icon: 'none' });
        return;
      }

      await postCityInfo({
        categoryId: form.value.categoryId,
        title: form.value.title.trim(),
        content: form.value.content.trim(),
        price: form.value.price ? Number(form.value.price) : undefined,
        address: form.value.address || undefined,
        latitude: locationStore.latitude,
        longitude: locationStore.longitude,
        images: imageUrls,
      });
      uni.showToast({ title: '提交成功，等待审核', icon: 'success' });
      form.value = { categoryId: 0, title: '', content: '', price: '', address: '' };
      fileList.value = [];
      activeRootId.value = 0;
      submitAttempted.value = false;
      touched.value = { title: false, content: false };
      setTimeout(() => uni.switchTab({ url: '/pages/home/index' }), 800);
    } catch (e) {
      uni.showToast({ title: (e as Error).message || '发布失败', icon: 'none' });
    } finally {
      submitting.value = false;
    }
  }

  /** 初始化发布页：分类优先展示，定位后台刷新（避免 Android 上 getLocation 阻塞页面） */
  async function initPublishPage() {
    pageLoading.value = true;
    try {
      categories.value = await queryCategoryTree();
      if (form.value.categoryId) {
        syncRootFromCategory(form.value.categoryId);
      } else if (categories.value.length) {
        activeRootId.value = categories.value[0].id;
      }
      if (!form.value.address) {
        form.value.address = locationStore.address || locationStore.cityName;
      }
      void locationStore.fetchLocation().then((ok) => {
        if (ok && !form.value.address.trim()) {
          form.value.address = locationStore.address || locationStore.cityName;
        }
      });
    } catch {
      uni.showToast({ title: '分类加载失败，请稍后重试', icon: 'none' });
    } finally {
      pageLoading.value = false;
    }
  }

  /** 支持从其他页带 categoryId 预填 */
  onLoad((query) => {
    hideNativeTabBar();
    tabBarStore.syncFromRoute();
    const presetId = Number(query?.categoryId || 0);
    if (presetId) form.value.categoryId = presetId;
  });

  onShow(() => {
    hideNativeTabBar();
    tabBarStore.syncFromRoute();
  });

  onMounted(() => {
    void initPublishPage();
  });

  return {
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
  };
}
