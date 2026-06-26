import type { ReactNode } from 'react';
import PermissionGuard from '../../../../components/PermissionGuard';
import { TechButton } from '../../../../components/tech-ui';

export interface AiAssistantToolbarProps {
  configStatus: ReactNode;
  configLoading: boolean;
  configModalOpen: boolean;
  onOpenConfig: () => void;
  onOpenSync: () => void;
}

/** 数据配置管理页顶栏操作 */
export default function AiAssistantToolbar({
  configStatus,
  configLoading,
  configModalOpen,
  onOpenConfig,
  onOpenSync,
}: AiAssistantToolbarProps) {
  return (
    <div className="ai-data-page__toolbar">
      <div className="ai-data-page__status">{configStatus}</div>
      <TechButton
        variant="primary"
        icon="mdi:cog-outline"
        loading={configLoading && !configModalOpen}
        onClick={onOpenConfig}
      >
        AI 配置
      </TechButton>
      <PermissionGuard code="admin:ai-assistant:sync">
        <TechButton variant="primary" icon="mdi:database-sync-outline" onClick={onOpenSync}>
          向量化数据
        </TechButton>
      </PermissionGuard>
    </div>
  );
}
