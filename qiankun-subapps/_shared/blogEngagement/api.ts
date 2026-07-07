import { apiUrl } from '../api';
import type {
  ArticleComment,
  ArticleCommentCreateResult,
  ArticleEngagement,
} from '../contentTypes';

/** 博客互动相关 REST 调用（query 读 / post 写） */
export const blogEngagementApi = {
  /** 查询互动统计与当前访客是否已点赞 / 收藏 */
  async queryEngagement(
    apiBase: string,
    articleId: number,
    visitorId?: string,
  ): Promise<ArticleEngagement> {
    const params = visitorId
      ? `?visitorId=${encodeURIComponent(visitorId)}`
      : '';
    const res = await fetch(
      apiUrl(apiBase, `/article/${articleId}/engagement${params}`),
    );
    if (!res.ok) throw new Error('互动数据加载失败');
    return res.json() as Promise<ArticleEngagement>;
  },

  /** 切换点赞 */
  async postToggleLike(
    apiBase: string,
    articleId: number,
    visitorId: string,
  ): Promise<ArticleEngagement> {
    const res = await fetch(apiUrl(apiBase, `/article/${articleId}/like`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId }),
    });
    if (!res.ok) throw new Error('点赞失败');
    return res.json() as Promise<ArticleEngagement>;
  },

  /** 切换收藏 */
  async postToggleBookmark(
    apiBase: string,
    articleId: number,
    visitorId: string,
  ): Promise<ArticleEngagement> {
    const res = await fetch(apiUrl(apiBase, `/article/${articleId}/bookmark`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId }),
    });
    if (!res.ok) throw new Error('收藏失败');
    return res.json() as Promise<ArticleEngagement>;
  },

  /** 查询评论列表 */
  async queryComments(
    apiBase: string,
    articleId: number,
  ): Promise<ArticleComment[]> {
    const res = await fetch(apiUrl(apiBase, `/article/${articleId}/comments`));
    if (!res.ok) throw new Error('评论加载失败');
    return res.json() as Promise<ArticleComment[]>;
  },

  /** 发表评论或回复 */
  async postComment(
    apiBase: string,
    articleId: number,
    payload: {
      nickname: string;
      content: string;
      visitorId?: string;
      parentId?: number;
    },
  ): Promise<ArticleCommentCreateResult> {
    const res = await fetch(apiUrl(apiBase, `/article/${articleId}/comments`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('评论发表失败');
    return res.json() as Promise<ArticleCommentCreateResult>;
  },
};
