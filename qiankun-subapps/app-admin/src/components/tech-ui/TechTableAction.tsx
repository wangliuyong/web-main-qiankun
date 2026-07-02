import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export interface TechTableActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** default 常规操作；danger 删除等破坏性操作 */
  variant?: 'default' | 'danger';
  children: ReactNode;
}

/**
 * 表格行内文字操作按钮
 * 无边框、无图标，宽度随文案自适应；forwardRef 供 Popconfirm 等定位
 */
const TechTableAction = forwardRef<HTMLButtonElement, TechTableActionProps>(function TechTableAction(
  { variant = 'default', className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
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
});

export default TechTableAction;
