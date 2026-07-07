import { buildPaginationPages } from '../../utils/blogPagination';
import { cn } from '../../utils/cn';

export interface BlogPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * 博客分页导航（纯展示 + 回调，不绑定路由）。
 * 总页数 ≤ 1 时不渲染。
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

  const pages = buildPaginationPages(page, totalPages);

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
