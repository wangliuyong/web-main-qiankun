import { apiUrl, fetchJson } from '../../../_shared/api';
import type { Article, LinkItem, PaginatedResult, Project } from '../../../_shared/contentTypes';
import { BLOG_PAGE_SIZE } from '../../../_shared/constants/blog';

/** 前台公开 REST 聚合（无需鉴权） */
export const webApi = {
  listArticles(
    apiBase: string,
    filters?: { category?: string; tag?: string },
  ): Promise<Article[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.set('category', filters.category);
    if (filters?.tag) params.set('tag', filters.tag);
    const qs = params.toString() ? `?${params}` : '';
    return fetchJson<Article[]>(apiUrl(apiBase, `/article/list${qs}`));
  },

  /** 分页文章列表（博客时间轴） */
  queryArticlesPage(
    apiBase: string,
    filters?: { category?: string; tag?: string; page?: number; pageSize?: number },
  ): Promise<PaginatedResult<Article>> {
    const params = new URLSearchParams();
    if (filters?.category) params.set('category', filters.category);
    if (filters?.tag) params.set('tag', filters.tag);
    params.set('page', String(filters?.page ?? 1));
    params.set('pageSize', String(filters?.pageSize ?? BLOG_PAGE_SIZE));
    return fetchJson<PaginatedResult<Article>>(apiUrl(apiBase, `/article/page?${params}`));
  },

  getArticle(apiBase: string, id: string | number): Promise<Article> {
    return fetchJson<Article>(apiUrl(apiBase, `/article/${id}`));
  },

  listProjects(apiBase: string): Promise<Project[]> {
    return fetchJson<Project[]>(apiUrl(apiBase, '/project/list'));
  },

  listLinks(apiBase: string): Promise<LinkItem[]> {
    return fetchJson<LinkItem[]>(apiUrl(apiBase, '/link/list'));
  },

  async submitMessage(
    apiBase: string,
    payload: { nickname: string; contact?: string; content: string },
  ): Promise<void> {
    const res = await fetch(apiUrl(apiBase, '/message'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('提交失败');
  },
};
