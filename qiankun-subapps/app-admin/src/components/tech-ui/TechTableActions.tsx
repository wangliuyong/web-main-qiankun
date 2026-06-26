import type { HTMLAttributes, ReactNode } from 'react';

export interface TechTableActionsProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/** 表格操作列容器：横向排列文字按钮，列宽随内容收缩 */
export default function TechTableActions({ className, children, ...rest }: TechTableActionsProps) {
  return (
    <div className={['tech-table-actions', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}
