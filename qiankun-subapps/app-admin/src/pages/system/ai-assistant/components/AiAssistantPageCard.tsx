import type { ReactNode } from 'react';
import { TechCard, TechIcon, TechPageShell } from '../../../../components/tech-ui';

export interface AiAssistantPageCardProps {
  extra: ReactNode;
  children: ReactNode;
  vectorTotal?: number;
  syncRecordCount?: number;
}

/** 数据配置管理主容器 */
export default function AiAssistantPageCard({
  extra,
  children,
  vectorTotal,
  syncRecordCount,
}: AiAssistantPageCardProps) {
  return (
    <TechPageShell
      title="数据配置管理"
      description="管理 AI 模型配置、内容向量化同步与 LanceDB 向量库统计"
      extra={extra}
      stats={[
        {
          label: '向量文档',
          value: vectorTotal ?? '-',
          icon: <TechIcon icon="mdi:database-outline" size={24} />,
          accent: true,
        },
        {
          label: '同步记录',
          value: syncRecordCount ?? '-',
          icon: <TechIcon icon="mdi:sync" size={24} />,
          hint: '历史同步任务',
        },
      ]}
    >
      <TechCard>{children}</TechCard>
    </TechPageShell>
  );
}
