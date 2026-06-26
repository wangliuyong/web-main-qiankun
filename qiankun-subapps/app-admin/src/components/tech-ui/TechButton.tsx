import type { ButtonHTMLAttributes, ReactNode } from 'react';
import TechIcon from './TechIcon';

export interface TechButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'default' | 'danger';
  loading?: boolean;
  icon?: string;
  children?: ReactNode;
}

/** 科技风按钮 */
export default function TechButton({
  variant = 'default',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...rest
}: TechButtonProps) {
  return (
    <button
      type="button"
      className={[
        'tech-btn',
        `tech-btn--${variant}`,
        loading && 'tech-btn--loading',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <TechIcon icon="svg-spinners:ring-resize" size={16} className="tech-btn__spinner" />
      ) : icon ? (
        <TechIcon icon={icon} size={16} />
      ) : null}
      {children ? <span>{children}</span> : null}
    </button>
  );
}
