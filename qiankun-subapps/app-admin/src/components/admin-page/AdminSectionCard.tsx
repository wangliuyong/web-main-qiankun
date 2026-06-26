import TechCard from '../tech-ui/TechCard';
import type { ReactNode } from 'react';

export interface AdminSectionCardProps {
  /** 区块小标题（可选，主标题已在 PageShell hero 中） */
  title?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
  /** 是否去掉内边距（表格贴边场景） */
  noPadding?: boolean;
}

/** 页面内容区卡片 — 基于 TechCard */
export default function AdminSectionCard({
  title,
  extra,
  children,
  noPadding = false,
}: AdminSectionCardProps) {
  return (
    <TechCard
      title={title}
      extra={extra}
      className={noPadding ? 'admin-section-card--flush' : undefined}
    >
      {children}
    </TechCard>
  );
}
