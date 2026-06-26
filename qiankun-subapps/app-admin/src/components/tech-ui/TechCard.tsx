import type { ReactNode } from 'react';

export interface TechCardProps {
  title?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
  inner?: boolean;
}

/** 玻璃质感面板卡片 */
export default function TechCard({ title, extra, children, className, inner }: TechCardProps) {
  return (
    <section
      className={[
        'tech-card',
        inner && 'tech-card--inner',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {(title || extra) && (
        <header className="tech-card__head">
          {title ? <h3 className="tech-card__title">{title}</h3> : <span />}
          {extra ? <div className="tech-card__extra">{extra}</div> : null}
        </header>
      )}
      <div className="tech-card__body">{children}</div>
    </section>
  );
}
