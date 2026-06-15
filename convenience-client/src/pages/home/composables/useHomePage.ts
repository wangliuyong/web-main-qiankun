import { ref, computed, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { queryBannerList } from '@/api/banner.api';
import { queryCategoryTree } from '@/api/category.api';
import { queryCityInfoList } from '@/api/city-info.api';
import { queryCollectedIds } from '@/api/collect.api';
import { queryNoticeList } from '@/api/notice.api';
import { openPublishPage } from '@/constants/tabbar';
import { useLocationStore } from '@/stores/location';
import type { BannerItem, CategoryItem, CityInfoItem, NoticeItem } from '@/types/city-info';

/**
 * 首页数据加载与导航逻辑
 * index.vue 仅负责组合子组件布局
 */
export function useHomePage() {
  const locationStore = useLocationStore();

  const banners = ref<BannerItem[]>([]);
  const notices = ref<NoticeItem[]>([]);
  const categories = ref<CategoryItem[]>([]);
  const infoList = ref<CityInfoItem[]>([]);
  const totalInfoCount = ref(0);
  const loading = ref(true);
  /** 省市区选择弹层 */
  const regionPickerShow = ref(false);

  /** 首页仅展示前 8 个一级分类 */
  const homeCategories = computed(() => categories.value.slice(0, 8));

  /** 全部子分类数量 */
  const totalSubCount = computed(() =>
    categories.value.reduce((sum, root) => sum + (root.children?.length || 0), 0),
  );

  /** 精选：列表第一条 */
  const featuredInfo = computed(() => infoList.value[0] || null);

  /** 双列网格：第 2-7 条 */
  const gridInfoList = computed(() => infoList.value.slice(1, 7));

  /** 加载首页数据（推荐列表与轮播/分类并行，避免被收藏接口 401 打断） */
  async function loadData() {
    loading.value = true;

    const lat = locationStore.latitude;
    const lng = locationStore.longitude;

    try {
      const [
        bannerResult,
        noticeResult,
        categoryResult,
        collectedResult,
        cityInfoResult,
      ] = await Promise.allSettled([
        queryBannerList(),
        queryNoticeList(),
        queryCategoryTree(),
        queryCollectedIds(),
        queryCityInfoList(
          { page: 1, pageSize: 7, sortBy: 'latest' },
          { lat, lng, collectedIds: [] },
        ),
      ]);

      if (bannerResult.status === 'fulfilled') {
        banners.value = bannerResult.value;
      }
      if (noticeResult.status === 'fulfilled') {
        notices.value = noticeResult.value;
      }
      if (categoryResult.status === 'fulfilled') {
        categories.value = categoryResult.value;
      }

      if (cityInfoResult.status === 'fulfilled') {
        const collectedIds =
          collectedResult.status === 'fulfilled' ? collectedResult.value : [];
        infoList.value = cityInfoResult.value.list.map((item) => ({
          ...item,
          collected: collectedIds.includes(item.id),
        }));
        totalInfoCount.value = cityInfoResult.value.total;
      } else {
        uni.showToast({ title: '推荐加载失败，请检查网络', icon: 'none' });
      }
    } catch {
      uni.showToast({ title: '推荐加载失败，请检查网络', icon: 'none' });
    } finally {
      loading.value = false;
    }
  }

  function openRegionPicker() {
    regionPickerShow.value = true;
  }

  function onRegionConfirm(payload: { province: string; city: string; district: string }) {
    locationStore.applyRegion(payload.province, payload.city, payload.district);
    void loadData();
  }

  function goSearch() {
    uni.navigateTo({ url: '/pages/info/list' });
  }

  function goPublish() {
    openPublishPage();
  }

  function goAi() {
    uni.switchTab({ url: '/pages/ai/index' });
  }

  function goCategoryTab() {
    uni.switchTab({ url: '/pages/category/index' });
  }

  function goNotice(id: number) {
    uni.navigateTo({ url: `/pages/notice/detail?id=${id}` });
  }

  function onCategorySelect(item: CategoryItem) {
    uni.navigateTo({ url: `/pages/info/list?categoryId=${item.id}&title=${item.name}` });
  }

  function goList() {
    uni.navigateTo({ url: '/pages/info/list' });
  }

  function goDetail(item: CityInfoItem) {
    uni.navigateTo({ url: `/pages/info/detail?id=${item.id}` });
  }

  onMounted(loadData);
  /** Tab 页切回首页时刷新推荐（小程序端缓存页面不会重新 onMounted） */
  onShow(() => {
    if (!loading.value && !infoList.value.length) {
      void loadData();
    }
  });

  return {
    locationStore,
    banners,
    notices,
    categories,
    homeCategories,
    totalInfoCount,
    totalSubCount,
    featuredInfo,
    gridInfoList,
    infoList,
    loading,
    regionPickerShow,
    openRegionPicker,
    onRegionConfirm,
    goSearch,
    goPublish,
    goAi,
    goCategoryTab,
    goNotice,
    onCategorySelect,
    goList,
    goDetail,
  };
}
