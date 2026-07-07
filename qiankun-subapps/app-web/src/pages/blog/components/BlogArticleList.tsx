import { BlogTimelineList } from '../../../../../_shared/components/blog';
import type { Article } from '../../../../../_shared/contentTypes';
import { Link } from 'react-router-dom';
import { blogDetailPath } from '../../../router/routes';

export interface BlogArticleListProps {
  articles: Article[];
}

/** 博客文章列表（相同日期仅首条展示时间） */
export default function BlogArticleList({ articles }: BlogArticleListProps) {
  return (
    <BlogTimelineList
      articles={articles}
      resolveHref={(id) => blogDetailPath(id)}
      renderLink={({ href, className, children }) => (
        <Link className={className} to={href}>
          {children}
        </Link>
      )}
    />
  );
}
