import {
  AppEmpty,
  BlogPagination,
  BlogTimelineList,
  PageTitle,
  SubApp,
} from '../../../../../_shared/components';
import type { Article } from '../../../../../_shared/contentTypes';
import { Link } from 'react-router-dom';
import { blogDetailPath } from '../../../router/routes';
import BlogListFilters from './BlogListFilters';

export interface BlogListViewProps {
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
  filterCategory: string;
  categories: string[];
  onCategoryChange: (value: string) => void;
  onTagBlur: (value: string) => void;
  onReload: () => void;
  onPageChange: (page: number) => void;
}

/** 博客列表页：筛选 + 时间轴 + 分页 */
export default function BlogListView({
  articles,
  total,
  page,
  pageSize,
  filterCategory,
  categories,
  onCategoryChange,
  onTagBlur,
  onReload,
  onPageChange,
}: BlogListViewProps) {
  return (
    <SubApp>
      <PageTitle className="mb-2">博客</PageTitle>
      <p className="text-muted text-sm mb-6">按时间轴浏览技术笔记，共 {total} 篇</p>

      <BlogListFilters
        filterCategory={filterCategory}
        categories={categories}
        onCategoryChange={onCategoryChange}
        onTagBlur={onTagBlur}
        onReload={onReload}
      />

      {articles.length === 0 ? (
        <AppEmpty>暂无符合条件的文章</AppEmpty>
      ) : (
        <>
          <BlogTimelineList
            articles={articles}
            resolveHref={(id) => blogDetailPath(id)}
            renderLink={({ href, className, children }) => (
              <Link className={className} to={href}>
                {children}
              </Link>
            )}
          />
          <BlogPagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={onPageChange}
          />
        </>
      )}
    </SubApp>
  );
}
