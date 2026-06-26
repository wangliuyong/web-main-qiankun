import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import TechEmpty from './TechEmpty';
import type { TechColumn, TechPagination, TechRowSelection } from './types';

export interface TechTableProps<T extends { id?: string | number }> {
  columns: TechColumn<T>[];
  dataSource: T[];
  rowKey?: keyof T | ((row: T) => string);
  loading?: boolean;
  pagination?: TechPagination | false;
  rowSelection?: TechRowSelection<T>;
  scroll?: { y?: number; x?: number };
  emptyText?: ReactNode;
  className?: string;
}

function resolveRowKey<T>(row: T, index: number, rowKey?: keyof T | ((row: T) => string)): string {
  if (typeof rowKey === 'function') return rowKey(row);
  if (rowKey && row[rowKey] != null) return String(row[rowKey]);
  const r = row as { id?: string | number };
  return r.id != null ? String(r.id) : String(index);
}

function resolveCellValue<T>(row: T, col: TechColumn<T>): unknown {
  if (!col.dataIndex) return undefined;
  return row[col.dataIndex];
}

/** 通用数据表格 */
export default function TechTable<T extends { id?: string | number }>({
  columns,
  dataSource,
  rowKey = 'id' as keyof T,
  loading = false,
  pagination,
  rowSelection,
  scroll,
  emptyText = '暂无数据',
  className,
}: TechTableProps<T>) {
  const [page, setPage] = useState(1);

  const pageSize = pagination && pagination !== false ? pagination.pageSize : dataSource.length;
  const total = pagination && pagination !== false ? (pagination.total ?? dataSource.length) : dataSource.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const pageData = useMemo(() => {
    if (!pagination) return dataSource;
    const start = (page - 1) * pageSize;
    return dataSource.slice(start, start + pageSize);
  }, [dataSource, page, pageSize, pagination]);

  const allKeys = dataSource.map((row, i) => resolveRowKey(row, i, rowKey));
  const selectedSet = new Set(rowSelection?.selectedRowKeys ?? []);
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selectedSet.has(k));

  const toggleAll = () => {
    if (!rowSelection) return;
    rowSelection.onChange(allSelected ? [] : allKeys);
  };

  const toggleRow = (key: string) => {
    if (!rowSelection) return;
    const next = selectedSet.has(key)
      ? rowSelection.selectedRowKeys.filter((k) => k !== key)
      : [...rowSelection.selectedRowKeys, key];
    rowSelection.onChange(next);
  };

  return (
    <div
      className={['tech-table-wrap', loading && 'tech-table-wrap--loading', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="tech-table-scroll" style={{ maxHeight: scroll?.y, overflowX: scroll?.x ? 'auto' : undefined }}>
        <table className="tech-table">
          <thead>
            <tr>
              {rowSelection ? (
                <th className="tech-table__check">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="全选" />
                </th>
              ) : null}
              {columns.map((col) => (
                <th key={col.key} className={col.className} style={{ width: col.width }}>{col.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (rowSelection ? 1 : 0)}>
                  <TechEmpty description={emptyText} />
                </td>
              </tr>
            ) : (
              pageData.map((row, rowIndex) => {
                const key = resolveRowKey(row, rowIndex, rowKey);
                return (
                  <tr key={key}>
                    {rowSelection ? (
                      <td className="tech-table__check">
                        <input
                          type="checkbox"
                          checked={selectedSet.has(key)}
                          onChange={() => toggleRow(key)}
                          aria-label={`选择行 ${key}`}
                        />
                      </td>
                    ) : null}
                    {columns.map((col) => {
                      const raw = resolveCellValue(row, col);
                      const content = col.render ? col.render(raw, row, rowIndex) : (raw as ReactNode) ?? '-';
                      return (
                        <td
                          key={col.key}
                          className={[col.className, col.ellipsis && 'tech-table__ellipsis'].filter(Boolean).join(' ') || undefined}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && pageCount > 1 ? (
        <footer className="tech-table__pager">
          <button type="button" className="tech-table__pager-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            上一页
          </button>
          <span className="tech-table__pager-info">{page} / {pageCount}</span>
          <button type="button" className="tech-table__pager-btn" disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)}>
            下一页
          </button>
        </footer>
      ) : null}
    </div>
  );
}
