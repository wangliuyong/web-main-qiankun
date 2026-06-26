import type { ReactNode } from 'react';

export type TechBadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

export interface TechBadgeProps {
  variant?: TechBadgeVariant;
  children: ReactNode;
  className?: string;
}

/** 状态标签 */
export default function TechBadge({ variant = 'default', children, className }: TechBadgeProps) {
  return (
    <span className={['tech-badge', `tech-badge--${variant}`, className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}
