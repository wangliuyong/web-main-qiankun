import { ref, computed, onMounted } from 'vue';
import { queryCategoryTree } from '@/api/category.api';
import type { CategoryItem } from '@/types/city-info';

/**
 * 分类 Tab 页：一级/二级分类浏览与跳转
 */
export function useCategoryPage() {
  const categories = ref<CategoryItem[]>([]);
  const activeRootId = ref(0);
  const loading = ref(true);

  const totalSubCount = computed(() =>
    categories.value.reduce((sum, root) => sum + (root.children?.length || 0), 0),
  );

  const activeRoot = computed(() => categories.value.find((c) => c.id === activeRootId.value));

  const activeRootIndex = computed(() =>
    categories.value.findIndex((c) => c.id === activeRootId.value),
  );

  const activeChildren = computed(() => activeRoot.value?.children || []);

  function onSelectRoot(item: CategoryItem) {
    activeRootId.value = item.id;
  }

  function goList(sub: CategoryItem) {
    uni.navigateTo({
      url: `/pages/info/list?categoryId=${sub.id}&title=${sub.name}&rootId=${activeRootId.value || ''}`,
    });
  }

  onMounted(async () => {
    loading.value = true;
    try {
      categories.value = await queryCategoryTree();
      if (categories.value.length) {
        activeRootId.value = categories.value[0].id;
      }
    } finally {
      loading.value = false;
    }
  });

  return {
    categories,
    activeRootId,
    activeRoot,
    activeRootIndex,
    activeChildren,
    totalSubCount,
    loading,
    onSelectRoot,
    goList,
  };
}
