import type { ReactNode } from 'react';
import type { TechSelectOption } from './types';

export interface TechSelectProps {
  label?: string;
  value?: string;
  options: TechSelectOption[];
  placeholder?: string;
  extra?: ReactNode;
  error?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/** 下拉选择 */
export default function TechSelect({
  label,
  value,
  options,
  placeholder,
  extra,
  error,
  onChange,
  className,
}: TechSelectProps) {
  return (
    <label className={['tech-field', className].filter(Boolean).join(' ')}>
      {label ? <span className="tech-field__label">{label}</span> : null}
      <select
        className="tech-select"
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {extra ? <span className="tech-field__extra">{extra}</span> : null}
      {error ? <span className="tech-field__error">{error}</span> : null}
    </label>
  );
}
