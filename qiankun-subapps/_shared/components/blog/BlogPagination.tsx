import { cn } from '../../utils/cn';

export interface BlogPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  /** 页码变更回调 */
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * 博客分页导航（纯展示 + 回调，不绑定路由）。
 * next-host 通过包装组件将 URL 与 onPageChange 对接。
 */
export function BlogPagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: BlogPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (totalPages <= 1) return null;

  const pages = buildPageNumbers(page, totalPages);

  return (
    <nav
      className={cn('blog-pagination', className)}
      aria-label="博客分页"
    >
      <button
        type="button"
        className="blog-pagination-btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="上一页"
      >
        上一页
      </button>

      <ul className="blog-pagination-pages">
        {pages.map((item, index) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${index}`} className="blog-pagination-ellipsis" aria-hidden>
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={cn(
                  'blog-pagination-page',
                  item === page && 'blog-pagination-page--active',
                )}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        className="blog-pagination-btn"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="下一页"
      >
        下一页
      </button>
    </nav>
  );
}

/** 生成带省略号的页码序列 */
function buildPageNumbers(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: Array<number | 'ellipsis'> = [1];

  if (current > 3) pages.push('ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push('ellipsis');

  pages.push(total);
  return pages;
}
