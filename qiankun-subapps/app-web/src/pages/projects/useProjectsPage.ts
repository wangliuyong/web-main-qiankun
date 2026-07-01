import { useMemo, useState } from 'react';
import {
  PROJECT_CATEGORY_FILTER_OPTIONS,
  type ProjectCategoryFilter,
} from '../../../../_shared/projectCategory';
import { useProjects } from './useProjects';

/** 作品集页：列表数据 + 个人/企业分类筛选 */
export function useProjectsPage() {
  const { projects, loading, error } = useProjects();
  const [filterCategory, setFilterCategory] = useState<ProjectCategoryFilter>('all');

  /** 按当前筛选条件过滤项目列表 */
  const filteredProjects = useMemo(() => {
    if (filterCategory === 'all') return projects;
    return projects.filter((item) => item.category === filterCategory);
  }, [projects, filterCategory]);

  /** 各分类数量，用于筛选按钮展示 */
  const categoryCounts = useMemo(() => {
    const counts: Record<ProjectCategoryFilter, number> = {
      all: projects.length,
      personal: 0,
      enterprise: 0,
    };
    for (const item of projects) {
      if (item.category === 'personal') counts.personal += 1;
      if (item.category === 'enterprise') counts.enterprise += 1;
    }
    return counts;
  }, [projects]);

  return {
    projects: filteredProjects,
    allProjects: projects,
    loading,
    error,
    filterCategory,
    setFilterCategory,
    categoryCounts,
  };
}
