'use client';

import { BlogPagination } from '@shared/components';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

export interface BlogPaginationNavProps {
  page: number;
  pageSize: number;
  total: number;
}

/**
 * 博客分页（URL searchParams 驱动）
 * 与 BlogListFilters 共用 category / tag，翻页时保留筛选条件。
 */
export default function BlogPaginationNav({
  page,
  pageSize,
  total,
}: BlogPaginationNavProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const onPageChange = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (nextPage <= 1) params.delete('page');
      else params.set('page', String(nextPage));

      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `/blog?${qs}` : '/blog');
      });
    },
    [router, searchParams],
  );

  return (
    <BlogPagination
      page={page}
      pageSize={pageSize}
      total={total}
      onPageChange={onPageChange}
      className={pending ? 'opacity-60 pointer-events-none' : undefined}
    />
  );
}
