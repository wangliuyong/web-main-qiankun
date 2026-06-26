import type { ReactNode } from 'react';
import TechEmpty from './TechEmpty';

export interface TechListItem {
  key: string;
  title: ReactNode;
  description?: ReactNode;
}

export interface TechListProps {
  dataSource: TechListItem[];
  emptyText?: ReactNode;
}

/** 简洁列表 */
export default function TechList({ dataSource, emptyText = '暂无数据' }: TechListProps) {
  if (!dataSource.length) return <TechEmpty description={emptyText} />;
  return (
    <ul className="tech-list">
      {dataSource.map((item) => (
        <li key={item.key} className="tech-list__item">
          <div className="tech-list__title">{item.title}</div>
          {item.description ? <div className="tech-list__desc">{item.description}</div> : null}
        </li>
      ))}
    </ul>
  );
}
