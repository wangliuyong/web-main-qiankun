import { AppEmpty, BlogTimelineList, PageTitle, SubApp } from '@shared/components';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import BlogListFilters from '@/components/blog/BlogListFilters';
import BlogPaginationNav from '@/components/blog/BlogPaginationNav';
import { BLOG_PAGE_SIZE } from '@shared/constants/blog';
import { getArticles, getArticlesPaginated } from '@/lib/serverApi';
import { blogDetailPath } from '@/router';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '博客 | 王刘永的个人网站',
  description: '技术笔记与工程实践文章',
};

export interface BlogListPageProps {
  searchParams: Promise<{ category?: string; tag?: string; page?: string }>;
}

/** 博客列表：时间轴归档 + URL 分页，筛选通过 searchParams 触发 SSR */
export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const { category, tag, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  const [allArticles, paged] = await Promise.all([
    getArticles(),
    getArticlesPaginated({
      category: category || undefined,
      tag: tag || undefined,
      page,
      pageSize: BLOG_PAGE_SIZE,
    }),
  ]);

  const categories = Array.from(
    new Set(allArticles.map((a) => a.category).filter(Boolean)),
  ) as string[];

  return (
    <SubApp>
      <PageTitle className="mb-2">博客</PageTitle>
      <p className="text-muted text-sm mb-6">
        按时间轴浏览技术笔记，共 {paged.total} 篇
      </p>

      <Suspense fallback={null}>
        <BlogListFilters categories={categories} />
      </Suspense>

      {paged.items.length === 0 ? (
        <AppEmpty>暂无符合条件的文章</AppEmpty>
      ) : (
        <>
          <BlogTimelineList
            articles={paged.items}
            resolveHref={(id) => blogDetailPath(id)}
          />
          <Suspense fallback={null}>
            <BlogPaginationNav
              page={paged.page}
              pageSize={paged.pageSize}
              total={paged.total}
            />
          </Suspense>
        </>
      )}
    </SubApp>
  );
}
