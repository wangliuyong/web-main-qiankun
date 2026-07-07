import { useCallback, useEffect, useRef, useState } from 'react';
import { blogEngagementApi } from './api';
import { getOrCreateVisitorId } from './visitorId';
import type { ArticleComment, ArticleEngagement } from '../contentTypes';

const COMMENT_MAX = 1000;
const SHARE_TIP_DURATION_MS = 3000;

export interface UseArticleEngagementOptions {
  apiBase: string;
  articleId: number;
}

/** 文章点赞与分享状态 */
export function useArticleEngagement({
  apiBase,
  articleId,
}: UseArticleEngagementOptions) {
  const [engagement, setEngagement] = useState<ArticleEngagement | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [shareTip, setShareTip] = useState('');
  const [error, setError] = useState('');
  const shareTipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearShareTipTimer = useCallback(() => {
    if (shareTipTimerRef.current) {
      clearTimeout(shareTipTimerRef.current);
      shareTipTimerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearShareTipTimer(), [clearShareTipTimer]);

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

  /** 分享：复制当前页链接到剪贴板 */
  const shareArticle = useCallback(async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';

    clearShareTipTimer();
    setShareTip('');
    setError('');

    try {
      await navigator.clipboard.writeText(url);
      setShareTip('复制链接成功');
      shareTipTimerRef.current = setTimeout(() => {
        setShareTip('');
        shareTipTimerRef.current = null;
      }, SHARE_TIP_DURATION_MS);
    } catch {
      setShareTip('复制失败，请手动复制地址栏链接');
    }
  }, [clearShareTipTimer]);

  return {
    engagement,
    loading,
    actionLoading,
    error,
    shareTip,
    toggleLike,
    shareArticle,
    reload: load,
  };
}

export interface UseArticleCommentsOptions {
  apiBase: string;
  articleId: number;
  onCommentCountChange?: (count: number) => void;
}

/** 文章评论列表、发表与回复 */
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
  const [replyingTo, setReplyingTo] = useState<ArticleComment | null>(null);
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

  const cancelReply = useCallback(() => {
    setReplyingTo(null);
    setContent('');
    setFormError('');
    setFormSuccess('');
  }, []);

  const startReply = useCallback((comment: ArticleComment) => {
    setReplyingTo(comment);
    setContent('');
    setFormError('');
    setFormSuccess('');
  }, []);

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
        setFormError(replyingTo ? '请填写回复内容' : '请填写评论内容');
        return;
      }
      if (trimmedContent.length > COMMENT_MAX) {
        setFormError(`内容不超过 ${COMMENT_MAX} 字`);
        return;
      }

      setSubmitting(true);
      try {
        const visitorId = getOrCreateVisitorId();
        const result = await blogEngagementApi.postComment(apiBase, articleId, {
          nickname: trimmedNickname,
          content: trimmedContent,
          visitorId: visitorId || undefined,
          parentId: replyingTo?.id,
        });

        setComments((prev) => [...prev, result.comment]);
        setContent('');
        const wasReply = Boolean(replyingTo);
        setReplyingTo(null);
        setFormSuccess(wasReply ? '回复已发表' : '评论已发表');
        onCommentCountChange?.(result.commentCount);
      } catch {
        setFormError('发表失败，请稍后重试');
      } finally {
        setSubmitting(false);
      }
    },
    [apiBase, articleId, nickname, content, replyingTo, onCommentCountChange],
  );

  return {
    comments,
    loading,
    submitting,
    nickname,
    setNickname,
    content,
    setContent,
    replyingTo,
    startReply,
    cancelReply,
    contentMax: COMMENT_MAX,
    formError,
    formSuccess,
    submitComment,
    reload: load,
  };
}
