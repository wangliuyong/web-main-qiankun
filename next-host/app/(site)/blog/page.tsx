import { PageTitle, SubApp } from '@shared/components';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import BlogArticleList from '@/components/blog/BlogArticleList';
import BlogListFilters from '@/components/blog/BlogListFilters';
import { getArticles, getArticlesPage } from '@/lib/serverApi';
import BlogListPagination from '@/components/blog/BlogListPagination';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '博客 | 王刘永的个人网站',
  description: '技术笔记与工程实践文章',
};

export interface BlogListPageProps {
  searchParams: Promise<{ category?: string; tag?: string; page?: string }>;
}

/** 博客列表 — 服务端渲染文章列表，筛选与分页通过 URL 参数触发重新请求 */
export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const { category, tag, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);

  const [allArticles, pageData] = await Promise.all([
    getArticles(),
    getArticlesPage({
      category: category || undefined,
      tag: tag || undefined,
      page,
    }),
  ]);

  const categories = Array.from(
    new Set(allArticles.map((a) => a.category).filter(Boolean)),
  ) as string[];

  return (
    <SubApp>
      <PageTitle className="mb-6">博客</PageTitle>
      <Suspense fallback={null}>
        <BlogListFilters categories={categories} />
      </Suspense>
      <BlogArticleList articles={pageData.list} />
      <Suspense fallback={null}>
        <BlogListPagination
          page={pageData.page}
          pageSize={pageData.pageSize}
          total={pageData.total}
        />
      </Suspense>
    </SubApp>
  );
}
