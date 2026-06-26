import type { InputHTMLAttributes, ReactNode } from 'react';
import TechIcon from './TechIcon';

export interface TechInputProps extends InputHTMLAttributes<HTMLInputElement> {
  prefixIcon?: string;
  label?: string;
  extra?: ReactNode;
  error?: string;
}

/** 输入框 */
export function TechInput({ prefixIcon, label, extra, error, className, ...rest }: TechInputProps) {
  return (
    <label className={['tech-field', className].filter(Boolean).join(' ')}>
      {label ? <span className="tech-field__label">{label}</span> : null}
      <span className="tech-input-wrap">
        {prefixIcon ? <TechIcon icon={prefixIcon} size={16} className="tech-input-wrap__prefix" /> : null}
        <input className="tech-input" {...rest} />
      </span>
      {extra ? <span className="tech-field__extra">{extra}</span> : null}
      {error ? <span className="tech-field__error">{error}</span> : null}
    </label>
  );
}

/** 密码输入框 */
export function TechPasswordInput(props: TechInputProps) {
  return <TechInput type="password" autoComplete="current-password" {...props} />;
}

/** 数字输入框 */
export function TechNumberInput({ value, onChange, min, max, label, extra, error, className }: {
  value?: number;
  onChange?: (v: number) => void;
  min?: number;
  max?: number;
  label?: string;
  extra?: ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <label className={['tech-field', className].filter(Boolean).join(' ')}>
      {label ? <span className="tech-field__label">{label}</span> : null}
      <input
        className="tech-input"
        type="number"
        value={value ?? ''}
        min={min}
        max={max}
        onChange={(e) => onChange?.(Number(e.target.value))}
      />
      {extra ? <span className="tech-field__extra">{extra}</span> : null}
      {error ? <span className="tech-field__error">{error}</span> : null}
    </label>
  );
}
