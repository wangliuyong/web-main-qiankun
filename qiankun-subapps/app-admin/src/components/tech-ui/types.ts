import type { ReactNode } from 'react';

/** 表格列定义 */
export interface TechColumn<T> {
  key: string;
  title: string;
  dataIndex?: keyof T & string;
  width?: number | string;
  /** 列单元格 className，常用于操作列 tech-table__actions */
  className?: string;
  ellipsis?: boolean;
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

/** 分页配置 */
export interface TechPagination {
  pageSize: number;
  total?: number;
  showSizeChanger?: boolean;
}

/** 行选择配置 */
export interface TechRowSelection<T> {
  selectedRowKeys: string[];
  onChange: (keys: string[]) => void;
  preserveSelectedRowKeys?: boolean;
}

/** Select 选项 */
export interface TechSelectOption {
  label: string;
  value: string;
}

/** 页面统计项 */
export interface TechStatItem {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  accent?: boolean;
}
