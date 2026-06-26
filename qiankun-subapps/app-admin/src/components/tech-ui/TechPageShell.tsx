import type { ReactNode } from 'react';
import TechStatCard from './TechStatCard';
import type { TechStatItem } from './types';

export interface TechPageShellProps {
  title: string;
  description?: string;
  extra?: ReactNode;
  stats?: TechStatItem[];
  children: ReactNode;
  className?: string;
}

/** 科技风页面外壳：Hero + 统计 + 内容区 */
export default function TechPageShell({
  title,
  description,
  extra,
  stats,
  children,
  className,
}: TechPageShellProps) {
  return (
    <div className={['tech-page', className].filter(Boolean).join(' ')}>
      <header className="tech-page__hero">
        <div className="tech-page__hero-glow" aria-hidden />
        <div className="tech-page__hero-copy">
          <h1 className="tech-page__title">{title}</h1>
          {description ? <p className="tech-page__desc">{description}</p> : null}
        </div>
        {extra ? <div className="tech-page__actions">{extra}</div> : null}
      </header>

      {stats && stats.length > 0 ? (
        <div className="tech-page__stats">
          {stats.map((item) => (
            <TechStatCard
              key={item.label}
              label={item.label}
              value={item.value}
              hint={item.hint}
              icon={item.icon}
              accent={item.accent}
            />
          ))}
        </div>
      ) : null}

      <div className="tech-page__body">{children}</div>
    </div>
  );
}
