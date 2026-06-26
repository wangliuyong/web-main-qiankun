import type { ReactNode } from 'react';
import TechIcon from './TechIcon';

export interface TechEmptyProps {
  description?: ReactNode;
}

/** 空状态 */
export default function TechEmpty({ description = '暂无数据' }: TechEmptyProps) {
  return (
    <div className="tech-empty">
      <TechIcon icon="mdi:inbox-outline" size={40} className="tech-empty__icon" />
      <p className="tech-empty__text">{description}</p>
    </div>
  );
}
