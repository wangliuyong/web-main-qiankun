import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import type { Article } from '../../../../_shared/contentTypes';
import { useApiBase } from '../../context/ApiBaseContext';
import { BLOG_PAGE_SIZE, webApi } from '../../utils/webApi';

/** 博客列表 / 详情数据与筛选、分页状态 */
export function useBlog() {
  const apiBase = useApiBase();
  const { id: articleId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = articleId ? ('detail' as const) : ('list' as const);
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [detail, setDetail] = useState<Article | null>(null);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [filterCategory, setFilterCategoryState] = useState('');
  const [filterTag, setFilterTagState] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);

  const setFilterCategory = useCallback(
    (value: string) => {
      setFilterCategoryState(value);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set('category', value);
        else next.delete('category');
        next.delete('page');
        return next;
      });
    },
    [setSearchParams],
  );

  const setFilterTag = useCallback(
    (value: string) => {
      setFilterTagState(value);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set('tag', value);
        else next.delete('tag');
        next.delete('page');
        return next;
      });
    },
    [setSearchParams],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (nextPage <= 1) next.delete('page');
        else next.set('page', String(nextPage));
        return next;
      });
    },
    [setSearchParams],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (mode === 'detail' && articleId) {
        const data = await webApi.getArticle(apiBase, articleId);
        setDetail(data);
        setArticles([]);
        setTotal(0);
        setAllArticles([]);
      } else {
        const category = searchParams.get('category') || filterCategory || undefined;
        const tag = searchParams.get('tag') || filterTag || undefined;

        const [all, pageData] = await Promise.all([
          webApi.listArticles(apiBase),
          webApi.listArticlesPage(apiBase, {
            category,
            tag,
            page,
            pageSize: BLOG_PAGE_SIZE,
          }),
        ]);

        setAllArticles(all);
        setArticles(pageData.list);
        setTotal(pageData.total);
        setDetail(null);
      }
    } catch {
      setError('博客加载失败');
    } finally {
      setLoading(false);
    }
  }, [apiBase, mode, articleId, searchParams, filterCategory, filterTag, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const categories = useMemo(
    () => [...new Set(allArticles.map((a) => a.category).filter(Boolean))] as string[],
    [allArticles],
  );

  return {
    mode,
    articles,
    total,
    page,
    pageSize: BLOG_PAGE_SIZE,
    detail,
    filterCategory: searchParams.get('category') || filterCategory,
    setFilterCategory,
    filterTag: searchParams.get('tag') || filterTag,
    setFilterTag,
    setPage,
    categories,
    loading,
    error,
    reload: load,
  };
}
