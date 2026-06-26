import type { ColumnType } from 'antd/es/table';
import type { TechColumn } from '../tech-ui/types';

/** 操作列单元格 class，配合 admin-page.scss 收缩列宽 */
export const ADMIN_TABLE_ACTIONS_CLASS = 'admin-table-actions-col';

/**
 * Ant Design Table 操作列通用配置
 * width: 1 让 antd 按最小列宽分配，实际宽度由单元格内容与 CSS 撑开
 */
export const adminTableActionColumnProps = {
  width: 1,
  className: ADMIN_TABLE_ACTIONS_CLASS,
  onCell: () => ({ className: ADMIN_TABLE_ACTIONS_CLASS }),
  onHeaderCell: () => ({ className: ADMIN_TABLE_ACTIONS_CLASS }),
} as const;

/** 合并 Ant Design 操作列，保留 render / fixed 等字段 */
export function mergeAdminActionColumn<T>(
  column: Pick<ColumnType<T>, 'title' | 'render'> & Partial<ColumnType<T>>,
): ColumnType<T> {
  return {
    ...adminTableActionColumnProps,
    ...column,
  };
}

/** TechTable 操作列 class */
export const TECH_TABLE_ACTIONS_CLASS = 'tech-table__actions';

/** 合并 TechTable 操作列 */
export function mergeTechActionColumn<T extends { id?: string | number }>(
  column: Pick<TechColumn<T>, 'key' | 'title' | 'render'> & Partial<TechColumn<T>>,
): TechColumn<T> {
  return {
    className: TECH_TABLE_ACTIONS_CLASS,
    ...column,
  };
}
