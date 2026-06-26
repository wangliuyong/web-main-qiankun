import { Icon } from '@iconify/react';
import type { ComponentProps } from 'react';

export interface TechIconProps extends Omit<ComponentProps<typeof Icon>, 'icon'> {
  /** Iconify 图标名，如 mdi:chart-line */
  icon: string;
  size?: number | string;
}

/** Iconify 图标封装 */
export default function TechIcon({ icon, size = 20, className, ...rest }: TechIconProps) {
  return (
    <Icon
      icon={icon}
      width={size}
      height={size}
      className={['tech-icon', className].filter(Boolean).join(' ')}
      {...rest}
    />
  );
}
