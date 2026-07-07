'use client';

import { BlogPagination } from '@shared/components';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

export interface BlogListPaginationProps {
  page: number;
  pageSize: number;
  total: number;
}

/**
 * 博客列表分页（客户端）
 * 通过 URL searchParams 的 page 驱动，与筛选参数共存
 */
export default function BlogListPagination({
  page,
  pageSize,
  total,
}: BlogListPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const onPageChange = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (nextPage <= 1) {
        params.delete('page');
      } else {
        params.set('page', String(nextPage));
      }

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
