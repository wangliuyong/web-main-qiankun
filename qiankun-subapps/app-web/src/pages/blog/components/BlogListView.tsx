import { BlogPagination, PageTitle, SubApp } from '../../../../../_shared/components';
import type { Article } from '../../../../../_shared/contentTypes';
import BlogArticleList from './BlogArticleList';
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
  onPageChange: (page: number) => void;
  onReload: () => void;
}

/** 博客列表页主视图 */
export default function BlogListView({
  articles,
  total,
  page,
  pageSize,
  filterCategory,
  categories,
  onCategoryChange,
  onTagBlur,
  onPageChange,
  onReload,
}: BlogListViewProps) {
  return (
    <SubApp>
      <PageTitle className="mb-6">博客</PageTitle>
      <BlogListFilters
        filterCategory={filterCategory}
        categories={categories}
        onCategoryChange={onCategoryChange}
        onTagBlur={onTagBlur}
        onReload={onReload}
      />
      <BlogArticleList articles={articles} />
      <BlogPagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
      />
    </SubApp>
  );
}
