import type { ReactNode } from 'react';
import type { Article } from '../../contentTypes';
import { groupArticlesByTimeline } from '../../utils/blogTimeline';
import { formatDate } from '../../utils/format';
import { cn } from '../../utils/cn';

export interface BlogTimelineListProps {
  articles: Article[];
  /** 生成详情页路径，如 /blog/1 */
  resolveHref: (id: number) => string;
  /**
   * 自定义链接渲染（子应用 SPA 可传入 react-router Link 包装）。
   * 默认使用原生 <a>，利于 SSR 与 SEO。
   */
  renderLink?: (props: {
    href: string;
    className?: string;
    children: ReactNode;
  }) => ReactNode;
  className?: string;
}

/** 博客文章时间轴列表（按年/月分组，左侧竖线节点） */
export function BlogTimelineList({
  articles,
  resolveHref,
  renderLink,
  className,
}: BlogTimelineListProps) {
  const yearGroups = groupArticlesByTimeline(articles);

  const Link = renderLink ?? DefaultLink;

  return (
    <div className={cn('blog-timeline', className)}>
      {yearGroups.map((yearGroup) => (
        <section className="blog-timeline-year" key={yearGroup.year}>
          <h2 className="blog-timeline-year-label">{yearGroup.yearLabel}</h2>

          <div className="blog-timeline-months">
            {yearGroup.months.map((monthGroup) => (
              <div className="blog-timeline-month" key={monthGroup.key}>
                <div className="blog-timeline-month-marker">
                  <span className="blog-timeline-dot" aria-hidden />
                  <time className="blog-timeline-month-label">{monthGroup.monthLabel}</time>
                </div>

                <ul className="blog-timeline-posts">
                  {monthGroup.articles.map((article) => (
                    <li className="blog-timeline-post" key={article.id}>
                      <Link
                        href={resolveHref(article.id)}
                        className="blog-timeline-post-link"
                      >
                        <time
                          className="blog-timeline-post-date"
                          dateTime={article.publishedAt}
                        >
                          {formatDate(article.publishedAt, 'medium')}
                        </time>
                        <div className="blog-timeline-post-body">
                          <h3 className="blog-timeline-post-title">{article.title}</h3>
                          {article.category && (
                            <span className="blog-timeline-post-category">
                              {article.category}
                            </span>
                          )}
                          <p className="blog-timeline-post-summary">
                            {article.summary || '暂无摘要'}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function DefaultLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a className={className} href={href}>
      {children}
    </a>
  );
}
