'use client';

import { useCallback, useMemo } from 'react';
import { buildCommentTree, type ArticleCommentNode } from '../../blogEngagement/commentTree';
import { formatEngagementCount } from '../../blogEngagement/formatCount';
import { useArticleComments, useArticleEngagement } from '../../blogEngagement/useArticleEngagement';
import { formatDate } from '../../utils/format';
import { AppButton, AppField, AppInput } from '../ui';
import type { ArticleComment } from '../../contentTypes';

export interface ArticleEngagementPanelProps {
  /** Nest API 根路径 */
  apiBase: string;
  articleId: number;
  articleTitle: string;
}

/** 格式化互动计数：大数缩写 */
function formatCount(count: number): string {
  return formatEngagementCount(count);
}

interface CommentReplyFormProps {
  nickname: string;
  setNickname: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  contentMax: number;
  submitting: boolean;
  target: ArticleComment;
  formError: string;
  formSuccess: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

/** 单条评论下的内联回复表单 */
function CommentReplyForm({
  nickname,
  setNickname,
  content,
  setContent,
  contentMax,
  submitting,
  target,
  formError,
  formSuccess,
  onSubmit,
  onCancel,
}: CommentReplyFormProps) {
  const contentLength = content.length;
  const contentNearLimit = contentLength > contentMax * 0.9;

  return (
    <form onSubmit={onSubmit} className="article-engagement__reply-form" noValidate>
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

      <p className="article-engagement__reply-hint">
        回复 <span className="article-engagement__reply-target">@{target.nickname}</span>
      </p>

      <div className="article-engagement__reply-fields">
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

        <AppField label="回复" required>
          <textarea
            required
            rows={3}
            className="app-input article-engagement__textarea resize-y"
            placeholder={`回复 @${target.nickname}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={submitting}
            maxLength={contentMax}
          />
          <p
            className={`article-engagement__counter${contentNearLimit ? ' article-engagement__counter--warn' : ''}`}
          >
            {contentLength} / {contentMax}
          </p>
        </AppField>
      </div>

      <div className="article-engagement__reply-actions">
        <AppButton type="submit" disabled={submitting}>
          {submitting ? '发表中...' : '发表回复'}
        </AppButton>
        <button
          type="button"
          className="article-engagement__reply-cancel"
          onClick={onCancel}
          disabled={submitting}
        >
          取消
        </button>
      </div>
    </form>
  );
}

interface CommentThreadItemProps {
  node: ArticleCommentNode;
  depth?: number;
  replyingToId: number | null;
  nickname: string;
  setNickname: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  contentMax: number;
  submitting: boolean;
  formError: string;
  formSuccess: string;
  onReply: (comment: ArticleComment) => void;
  onCancelReply: () => void;
  onSubmitReply: (e: React.FormEvent) => void;
}

/** 单条评论及其子回复（递归渲染） */
function CommentThreadItem({
  node,
  depth = 0,
  replyingToId,
  nickname,
  setNickname,
  content,
  setContent,
  contentMax,
  submitting,
  formError,
  formSuccess,
  onReply,
  onCancelReply,
  onSubmitReply,
}: CommentThreadItemProps) {
  const isReplying = replyingToId === node.id;

  return (
    <li
      className={`article-engagement__item${depth > 0 ? ' article-engagement__item--nested' : ''}`}
      style={depth > 0 ? { ['--comment-depth' as string]: depth } : undefined}
    >
      <div className="article-engagement__item-head">
        <span className="article-engagement__item-name">{node.nickname}</span>
        {node.replyToNickname && (
          <span className="article-engagement__item-reply-to">
            回复 @{node.replyToNickname}
          </span>
        )}
        <time className="article-engagement__item-time" dateTime={node.createdAt}>
          {formatDate(node.createdAt, 'datetimeSeconds')}
        </time>
      </div>

      <p className="article-engagement__item-body">{node.content}</p>

      <button
        type="button"
        className="article-engagement__reply-btn"
        onClick={() => onReply(node)}
        disabled={submitting}
      >
        回复
      </button>

      {isReplying && (
        <CommentReplyForm
          nickname={nickname}
          setNickname={setNickname}
          content={content}
          setContent={setContent}
          contentMax={contentMax}
          submitting={submitting}
          target={node}
          formError={formError}
          formSuccess={formSuccess}
          onSubmit={onSubmitReply}
          onCancel={onCancelReply}
        />
      )}

      {node.children.length > 0 && (
        <ul className="article-engagement__list article-engagement__list--nested">
          {node.children.map((child) => (
            <CommentThreadItem
              key={child.id}
              node={child}
              depth={depth + 1}
              replyingToId={replyingToId}
              nickname={nickname}
              setNickname={setNickname}
              content={content}
              setContent={setContent}
              contentMax={contentMax}
              submitting={submitting}
              formError={formError}
              formSuccess={formSuccess}
              onReply={onReply}
              onCancelReply={onCancelReply}
              onSubmitReply={onSubmitReply}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * 博客详情互动区：点赞、收藏、分享与评论。
 * 客户端组件，供 app-web 与 next-host 共用。
 */
export function ArticleEngagementPanel({
  apiBase,
  articleId,
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
    replyingTo,
    startReply,
    cancelReply,
    contentMax,
    formError,
    formSuccess,
    submitComment,
  } = useArticleComments({
    apiBase,
    articleId,
    onCommentCountChange: handleCommentCountChange,
  });

  const commentTree = useMemo(() => buildCommentTree(comments), [comments]);
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
          onClick={() => void shareArticle()}
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
          className={`article-engagement__tip${engagementError ? ' article-engagement__tip--error' : ' article-engagement__tip--success'}`}
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

        <form
          onSubmit={(e) => {
            if (replyingTo) return;
            void submitComment(e);
          }}
          className="article-engagement__form"
          noValidate
        >
          {formError && !replyingTo && (
            <p className="article-engagement__feedback article-engagement__feedback--error" role="alert">
              {formError}
            </p>
          )}
          {formSuccess && !replyingTo && (
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
              disabled={submitting || Boolean(replyingTo)}
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
            <AppButton type="submit" disabled={submitting || Boolean(replyingTo)}>
              {submitting ? '发表中...' : '发表评论'}
            </AppButton>
          </div>
        </form>

        {commentsLoading ? (
          <p className="article-engagement__loading">评论加载中...</p>
        ) : commentTree.length === 0 ? (
          <p className="article-engagement__empty">还没有评论，来抢沙发吧。</p>
        ) : (
          <ul className="article-engagement__list app-stagger-sm">
            {commentTree.map((node) => (
              <CommentThreadItem
                key={node.id}
                node={node}
                replyingToId={replyingTo?.id ?? null}
                nickname={nickname}
                setNickname={setNickname}
                content={content}
                setContent={setContent}
                contentMax={contentMax}
                submitting={submitting}
                formError={formError}
                formSuccess={formSuccess}
                onReply={startReply}
                onCancelReply={cancelReply}
                onSubmitReply={submitComment}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
