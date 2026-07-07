'use client';

import { useCallback } from 'react';
import { formatDate } from '../../utils/format';
import { AppButton, AppField, AppInput } from '../ui';
import { useArticleComments, useArticleEngagement } from '../../blogEngagement/useArticleEngagement';

export interface ArticleEngagementPanelProps {
  /** Nest API 根路径 */
  apiBase: string;
  articleId: number;
  articleTitle: string;
}

/** 格式化互动计数：大数缩写 */
function formatCount(count: number): string {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}万`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

/**
 * 博客详情互动区：点赞、收藏、分享与评论。
 * 客户端组件，供 app-web 与 next-host 共用。
 */
export function ArticleEngagementPanel({
  apiBase,
  articleId,
  articleTitle,
}: ArticleEngagementPanelProps) {
  const {
    engagement,
    loading: engagementLoading,
    actionLoading,
    error: engagementError,
    shareTip,
    toggleLike,
    toggleBookmark,
    shareArticle,
    reload: reloadEngagement,
  } = useArticleEngagement({ apiBase, articleId });

  const handleCommentCountChange = useCallback(() => {
    void reloadEngagement();
  }, [reloadEngagement]);

  const {
    comments,
    loading: commentsLoading,
    submitting,
    nickname,
    setNickname,
    content,
    setContent,
    contentMax,
    formError,
    formSuccess,
    submitComment,
  } = useArticleComments({
    apiBase,
    articleId,
    onCommentCountChange: handleCommentCountChange,
  });

  const contentLength = content.length;
  const contentNearLimit = contentLength > contentMax * 0.9;

  return (
    <div className="article-engagement app-section">
      {/* 互动工具栏 */}
      <div className="article-engagement__toolbar" role="group" aria-label="文章互动">
        <button
          type="button"
          className={`article-engagement__action${engagement?.liked ? ' article-engagement__action--active' : ''}`}
          onClick={() => void toggleLike()}
          disabled={engagementLoading || actionLoading}
          aria-pressed={engagement?.liked ?? false}
        >
          <span className="article-engagement__action-label">点赞</span>
          <span className="article-engagement__action-count">
            {engagementLoading ? '…' : formatCount(engagement?.likeCount ?? 0)}
          </span>
        </button>

        <button
          type="button"
          className={`article-engagement__action${engagement?.bookmarked ? ' article-engagement__action--active' : ''}`}
          onClick={() => void toggleBookmark()}
          disabled={engagementLoading || actionLoading}
          aria-pressed={engagement?.bookmarked ?? false}
        >
          <span className="article-engagement__action-label">收藏</span>
          <span className="article-engagement__action-count">
            {engagementLoading ? '…' : formatCount(engagement?.bookmarkCount ?? 0)}
          </span>
        </button>

        <button
          type="button"
          className="article-engagement__action"
          onClick={() => void shareArticle(articleTitle)}
          disabled={engagementLoading}
        >
          <span className="article-engagement__action-label">分享</span>
        </button>

        <span className="article-engagement__meta">
          {engagementLoading
            ? ''
            : `${formatCount(engagement?.commentCount ?? comments.length)} 条评论`}
        </span>
      </div>

      {(engagementError || shareTip) && (
        <p
          className={`article-engagement__tip${engagementError ? ' article-engagement__tip--error' : ''}`}
          role={engagementError ? 'alert' : 'status'}
        >
          {engagementError || shareTip}
        </p>
      )}

      {/* 评论区块 */}
      <section className="article-engagement__comments" aria-labelledby="article-comments-heading">
        <h2 id="article-comments-heading" className="article-engagement__comments-title">
          评论
        </h2>

        <form onSubmit={submitComment} className="article-engagement__form" noValidate>
          {formError && (
            <p className="article-engagement__feedback article-engagement__feedback--error" role="alert">
              {formError}
            </p>
          )}
          {formSuccess && (
            <p className="article-engagement__feedback article-engagement__feedback--success" role="status">
              {formSuccess}
            </p>
          )}

          <div className="article-engagement__form-row">
            <AppField label="昵称" required>
              <AppInput
                required
                autoComplete="nickname"
                placeholder="怎么称呼你"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                disabled={submitting}
              />
            </AppField>
          </div>

          <AppField label="评论" required>
            <textarea
              required
              rows={4}
              className="app-input article-engagement__textarea resize-y"
              placeholder="写下你的想法"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={submitting}
              maxLength={contentMax}
              aria-describedby="article-comment-hint"
            />
            <p
              id="article-comment-hint"
              className={`article-engagement__counter${contentNearLimit ? ' article-engagement__counter--warn' : ''}`}
            >
              {contentLength} / {contentMax}
            </p>
          </AppField>

          <div className="article-engagement__form-actions">
            <AppButton type="submit" disabled={submitting}>
              {submitting ? '发表中...' : '发表评论'}
            </AppButton>
          </div>
        </form>

        {commentsLoading ? (
          <p className="article-engagement__loading">评论加载中...</p>
        ) : comments.length === 0 ? (
          <p className="article-engagement__empty">还没有评论，来抢沙发吧。</p>
        ) : (
          <ul className="article-engagement__list app-stagger-sm">
            {comments.map((comment) => (
              <li key={comment.id} className="article-engagement__item">
                <div className="article-engagement__item-head">
                  <span className="article-engagement__item-name">{comment.nickname}</span>
                  <time className="article-engagement__item-time" dateTime={comment.createdAt}>
                    {formatDate(comment.createdAt)}
                  </time>
                </div>
                <p className="article-engagement__item-body">{comment.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
