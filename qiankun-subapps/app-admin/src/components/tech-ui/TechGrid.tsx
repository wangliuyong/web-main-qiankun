import type { ReactNode } from 'react';

export interface TechGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6;
  gap?: number;
  className?: string;
}

/** 响应式 CSS Grid 布局 */
export default function TechGrid({ children, cols = 2, gap = 16, className }: TechGridProps) {
  return (
    <div
      className={['tech-grid', `tech-grid--cols-${cols}`, className].filter(Boolean).join(' ')}
      style={{ gap }}
    >
      {children}
    </div>
  );
}

export interface TechColProps {
  children: ReactNode;
  span?: 1 | 2;
  className?: string;
}

/** Grid 子列（用于 panels 双列布局） */
export function TechCol({ children, span = 1, className }: TechColProps) {
  return (
    <div className={['tech-col', span === 2 && 'tech-col--wide', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
