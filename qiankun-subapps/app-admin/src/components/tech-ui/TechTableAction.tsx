import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface TechTableActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** default 常规操作；danger 删除等破坏性操作 */
  variant?: 'default' | 'danger';
  children: ReactNode;
}

/**
 * 表格行内文字操作按钮
 * 无边框、无图标，宽度随文案自适应
 */
export default function TechTableAction({
  variant = 'default',
  className,
  children,
  type = 'button',
  ...rest
}: TechTableActionProps) {
  return (
    <button
      type={type}
      className={[
        'tech-table-action',
        variant === 'danger' && 'tech-table-action--danger',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
