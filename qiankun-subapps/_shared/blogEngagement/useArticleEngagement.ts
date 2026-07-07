import { useCallback, useEffect, useState } from 'react';
import { blogEngagementApi } from './api';
import { getOrCreateVisitorId } from './visitorId';
import type { ArticleComment, ArticleEngagement } from '../contentTypes';

const COMMENT_MAX = 1000;

export interface UseArticleEngagementOptions {
  apiBase: string;
  articleId: number;
}

/** 文章点赞、收藏与分享状态 */
export function useArticleEngagement({
  apiBase,
  articleId,
}: UseArticleEngagementOptions) {
  const [engagement, setEngagement] = useState<ArticleEngagement | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [shareTip, setShareTip] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!apiBase || !articleId) return;

    setLoading(true);
    setError('');
    try {
      const visitorId = getOrCreateVisitorId();
      const data = await blogEngagementApi.queryEngagement(
        apiBase,
        articleId,
        visitorId || undefined,
      );
      setEngagement(data);
    } catch {
      setError('互动数据加载失败');
    } finally {
      setLoading(false);
    }
  }, [apiBase, articleId]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleLike = useCallback(async () => {
    const visitorId = getOrCreateVisitorId();
    if (!visitorId) return;

    setActionLoading(true);
    setError('');
    try {
      const data = await blogEngagementApi.postToggleLike(
        apiBase,
        articleId,
        visitorId,
      );
      setEngagement(data);
    } catch {
      setError('点赞失败，请稍后重试');
    } finally {
      setActionLoading(false);
    }
  }, [apiBase, articleId]);

  const toggleBookmark = useCallback(async () => {
    const visitorId = getOrCreateVisitorId();
    if (!visitorId) return;

    setActionLoading(true);
    setError('');
    try {
      const data = await blogEngagementApi.postToggleBookmark(
        apiBase,
        articleId,
        visitorId,
      );
      setEngagement(data);
    } catch {
      setError('收藏失败，请稍后重试');
    } finally {
      setActionLoading(false);
    }
  }, [apiBase, articleId]);

  /** 分享：优先系统分享，降级为复制链接 */
  const shareArticle = useCallback(
    async (title: string) => {
      const url = typeof window !== 'undefined' ? window.location.href : '';

      setShareTip('');
      try {
        if (navigator.share) {
          await navigator.share({ title, url });
          setShareTip('已唤起分享');
          return;
        }

        await navigator.clipboard.writeText(url);
        setShareTip('链接已复制');
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setShareTip('分享失败，请手动复制地址栏链接');
      }
    },
    [],
  );

  return {
    engagement,
    loading,
    actionLoading,
    error,
    shareTip,
    toggleLike,
    toggleBookmark,
    shareArticle,
    reload: load,
  };
}

export interface UseArticleCommentsOptions {
  apiBase: string;
  articleId: number;
  onCommentCountChange?: (count: number) => void;
}

/** 文章评论列表与发表 */
export function useArticleComments({
  apiBase,
  articleId,
  onCommentCountChange,
}: UseArticleCommentsOptions) {
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const load = useCallback(async () => {
    if (!apiBase || !articleId) return;

    setLoading(true);
    try {
      const list = await blogEngagementApi.queryComments(apiBase, articleId);
      setComments(list);
      onCommentCountChange?.(list.length);
    } catch {
      setFormError('评论加载失败');
    } finally {
      setLoading(false);
    }
  }, [apiBase, articleId, onCommentCountChange]);

  useEffect(() => {
    void load();
  }, [load]);

  const submitComment = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError('');
      setFormSuccess('');

      const trimmedNickname = nickname.trim();
      const trimmedContent = content.trim();

      if (!trimmedNickname) {
        setFormError('请填写昵称');
        return;
      }
      if (!trimmedContent) {
        setFormError('请填写评论内容');
        return;
      }
      if (trimmedContent.length > COMMENT_MAX) {
        setFormError(`评论不超过 ${COMMENT_MAX} 字`);
        return;
      }

      setSubmitting(true);
      try {
        const visitorId = getOrCreateVisitorId();
        const result = await blogEngagementApi.postComment(apiBase, articleId, {
          nickname: trimmedNickname,
          content: trimmedContent,
          visitorId: visitorId || undefined,
        });

        setComments((prev) => [...prev, result.comment]);
        setContent('');
        setFormSuccess('评论已发表');
        onCommentCountChange?.(result.commentCount);
      } catch {
        setFormError('发表失败，请稍后重试');
      } finally {
        setSubmitting(false);
      }
    },
    [apiBase, articleId, nickname, content, onCommentCountChange],
  );

  return {
    comments,
    loading,
    submitting,
    nickname,
    setNickname,
    content,
    setContent,
    contentMax: COMMENT_MAX,
    formError,
    formSuccess,
    submitComment,
    reload: load,
  };
}
