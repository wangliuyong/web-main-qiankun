import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Article } from '../../../../_shared/contentTypes';
import { BLOG_PAGE_SIZE } from '../../../../_shared/constants/blog';
import { useApiBase } from '../../context/ApiBaseContext';
import { webApi } from '../../utils/webApi';

/** 博客列表 / 详情数据、筛选与分页状态 */
export function useBlog() {
  const apiBase = useApiBase();
  const { id: articleId } = useParams();
  const mode = articleId ? ('detail' as const) : ('list' as const);

  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Article | null>(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [allCategoriesSource, setAllCategoriesSource] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (mode === 'detail' && articleId) {
        const data = await webApi.getArticle(apiBase, articleId);
        setDetail(data);
        setArticles([]);
        setTotal(0);
      } else {
        const [allList, paged] = await Promise.all([
          webApi.listArticles(apiBase),
          webApi.queryArticlesPage(apiBase, {
            category: filterCategory || undefined,
            tag: filterTag || undefined,
            page,
            pageSize: BLOG_PAGE_SIZE,
          }),
        ]);
        setAllCategoriesSource(allList);
        setArticles(paged.items);
        setTotal(paged.total);
        setDetail(null);
      }
    } catch {
      setError('博客加载失败');
    } finally {
      setLoading(false);
    }
  }, [apiBase, mode, articleId, filterCategory, filterTag, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const categories = useMemo(
    () =>
      [...new Set(allCategoriesSource.map((a) => a.category).filter(Boolean))] as string[],
    [allCategoriesSource],
  );

  const handleCategoryChange = useCallback((value: string) => {
    setFilterCategory(value);
    setPage(1);
  }, []);

  const handleTagBlur = useCallback((value: string) => {
    setFilterTag(value.trim());
    setPage(1);
  }, []);

  const handleReload = useCallback(() => {
    void load();
  }, [load]);

  return {
    mode,
    articles,
    total,
    page,
    pageSize: BLOG_PAGE_SIZE,
    setPage,
    detail,
    filterCategory,
    setFilterCategory: handleCategoryChange,
    filterTag,
    setFilterTag: handleTagBlur,
    categories,
    loading,
    error,
    reload: handleReload,
  };
}
