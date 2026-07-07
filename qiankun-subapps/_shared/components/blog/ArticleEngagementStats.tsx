import { formatEngagementCount } from '../../blogEngagement/formatCount';
import { cn } from '../../utils/cn';

export interface ArticleEngagementStatsProps {
  likeCount?: number;
  bookmarkCount?: number;
  commentCount?: number;
  className?: string;
}

/**
 * 文章互动数据展示：点赞、收藏、评论数量。
 * 用于博客列表等只读场景，样式与详情页工具栏语义一致。
 */
export function ArticleEngagementStats({
  likeCount = 0,
  bookmarkCount = 0,
  commentCount = 0,
  className,
}: ArticleEngagementStatsProps) {
  return (
    <div
      className={cn('article-engagement-stats', className)}
      aria-label={`点赞 ${likeCount}，收藏 ${bookmarkCount}，评论 ${commentCount}`}
    >
      <span className="article-engagement-stats__item">
        <span className="article-engagement-stats__label">点赞</span>
        <span className="article-engagement-stats__value">
          {formatEngagementCount(likeCount)}
        </span>
      </span>
      <span className="article-engagement-stats__item">
        <span className="article-engagement-stats__label">收藏</span>
        <span className="article-engagement-stats__value">
          {formatEngagementCount(bookmarkCount)}
        </span>
      </span>
      <span className="article-engagement-stats__item">
        <span className="article-engagement-stats__label">评论</span>
        <span className="article-engagement-stats__value">
          {formatEngagementCount(commentCount)}
        </span>
      </span>
    </div>
  );
}
