/** 分页页码项：数字页码或省略号 */
export type PaginationPageItem = number | 'ellipsis';

/**
 * 生成分页页码序列（含首尾与当前页邻近页，中间以省略号折叠）。
 * @param current - 当前页码（从 1 开始）
 * @param totalPages - 总页数
 */
export function buildPaginationPages(current: number, totalPages: number): PaginationPageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, current, current - 1, current + 1]);
  const sorted = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const result: PaginationPageItem[] = [];

  for (let index = 0; index < sorted.length; index += 1) {
    const page = sorted[index];
    const prev = sorted[index - 1];

    if (index > 0 && prev != null && page - prev > 1) {
      result.push('ellipsis');
    }

    result.push(page);
  }

  return result;
}
