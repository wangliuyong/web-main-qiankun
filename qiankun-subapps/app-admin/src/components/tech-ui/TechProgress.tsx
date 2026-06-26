export interface TechProgressProps {
  percent: number;
  status?: 'normal' | 'danger';
  label?: string;
}

/** 进度条 */
export default function TechProgress({ percent, status = 'normal', label }: TechProgressProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="tech-progress">
      {label ? <div className="tech-progress__label">{label}</div> : null}
      <div className="tech-progress__track">
        <div
          className={['tech-progress__bar', status === 'danger' && 'tech-progress__bar--danger']
            .filter(Boolean)
            .join(' ')}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
