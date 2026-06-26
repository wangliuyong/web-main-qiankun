import type { ReactNode } from 'react';
import TechIcon from './TechIcon';

export type TechAlertType = 'info' | 'success' | 'warning' | 'error';

const ICON_MAP: Record<TechAlertType, string> = {
  info: 'mdi:information-outline',
  success: 'mdi:check-circle-outline',
  warning: 'mdi:alert-outline',
  error: 'mdi:close-circle-outline',
};

export interface TechAlertProps {
  type?: TechAlertType;
  message: ReactNode;
  description?: ReactNode;
  className?: string;
}

/** 提示条 */
export default function TechAlert({ type = 'info', message, description, className }: TechAlertProps) {
  return (
    <div className={['tech-alert', `tech-alert--${type}`, className].filter(Boolean).join(' ')} role="alert">
      <TechIcon icon={ICON_MAP[type]} size={18} className="tech-alert__icon" />
      <div className="tech-alert__content">
        <div className="tech-alert__message">{message}</div>
        {description ? <div className="tech-alert__desc">{description}</div> : null}
      </div>
    </div>
  );
}
