import { apiUrl, fetchJson } from '../../../_shared/api';
import type { Article, ArticlePageResult, LinkItem, Project } from '../../../_shared/contentTypes';

/** 博客列表每页条数 */
export const BLOG_PAGE_SIZE = 10;

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

  listArticlesPage(
    apiBase: string,
    filters?: { category?: string; tag?: string; page?: number; pageSize?: number },
  ): Promise<ArticlePageResult> {
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? BLOG_PAGE_SIZE;
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (filters?.category) params.set('category', filters.category);
    if (filters?.tag) params.set('tag', filters.tag);
    return fetchJson<ArticlePageResult>(apiUrl(apiBase, `/article/list?${params}`));
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
