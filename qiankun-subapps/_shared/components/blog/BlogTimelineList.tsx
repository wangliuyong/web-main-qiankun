import type { AnchorHTMLAttributes, ReactNode } from 'react';
import type { Article } from '../../contentTypes';
import { BLOG_LIST_DATE_FORMAT, shouldShowArticleDate } from '../../utils/blogTimeline';
import { formatDate } from '../../utils/format';
import { cn } from '../../utils/cn';
import { ArticleEngagementStats } from './ArticleEngagementStats';

export interface BlogTimelineListProps {
  articles: Article[];
  /** 生成详情页路径，如 /blog/1 */
  resolveHref: (id: number) => string;
  /** 自定义链接组件（Next.js Link / React Router Link）；默认使用 <a> */
  renderLink?: (props: {
    href: string;
    className: string;
    children: ReactNode;
  }) => ReactNode;
  className?: string;
}

/** 默认原生链接，适用于 SSR */
function DefaultLink({
  href,
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={className} href={href} {...props}>
      {children}
    </a>
  );
}

/**
 * 博客时间线列表：横排布局，相同发布日期仅首条展示时间。
 */
export function BlogTimelineList({
  articles,
  resolveHref,
  renderLink,
  className,
}: BlogTimelineListProps) {
  const Link = renderLink ?? DefaultLink;

  if (!articles.length) {
    return <p className="home-empty">暂无文章，稍后再来看看。</p>;
  }

  return (
    <ul className={cn('home-post-list', className)}>
      {articles.map((item, index) => {
        const showDate = shouldShowArticleDate(articles, index);

        return (
          <li className="home-post-item" key={item.id}>
            <Link className="home-post-link" href={resolveHref(item.id)}>
              {showDate ? (
                <time className="home-post-meta" dateTime={item.publishedAt}>
                  {formatDate(item.publishedAt, BLOG_LIST_DATE_FORMAT)}
                </time>
              ) : (
                <span className="home-post-meta home-post-meta--hidden" aria-hidden="true" />
              )}
              <div className="home-post-body">
                <h2 className="home-post-title">{item.title}</h2>
                <p className="home-post-summary">{item.summary || '暂无摘要'}</p>
                <ArticleEngagementStats
                  likeCount={item.likeCount}
                  commentCount={item.commentCount}
                />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
