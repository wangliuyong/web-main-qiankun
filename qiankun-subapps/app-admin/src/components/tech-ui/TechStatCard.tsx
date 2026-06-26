import type { ReactNode } from 'react';

export interface TechStatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  accent?: boolean;
}

/** 指标统计卡片 */
export default function TechStatCard({ label, value, hint, icon, accent }: TechStatCardProps) {
  return (
    <div className={['tech-stat-card', accent && 'tech-stat-card--accent'].filter(Boolean).join(' ')}>
      {icon ? <div className="tech-stat-card__icon">{icon}</div> : null}
      <span className="tech-stat-card__label">{label}</span>
      <span className="tech-stat-card__value">{value}</span>
      {hint ? <span className="tech-stat-card__hint">{hint}</span> : null}
    </div>
  );
}
