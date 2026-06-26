import type { AiConfigResponse } from '../../../../api/ai.api';
import { TechBadge } from '../../../../components/tech-ui';

export interface AiConfigStatusTagsProps {
  loading: boolean;
  config: AiConfigResponse | null;
}

/** AI 配置状态标签 */
export default function AiConfigStatusTags({ loading, config }: AiConfigStatusTagsProps) {
  if (loading) return null;
  return (
    <>
      {config?.hasApiKey ? (
        <TechBadge variant="success">
          已配置 API Key{config.apiKeyMasked ? `（${config.apiKeyMasked}）` : ''}
        </TechBadge>
      ) : (
        <TechBadge variant="warning">未配置 API Key</TechBadge>
      )}
      {config?.fromEnv ? <TechBadge variant="info">Key 来自环境变量</TechBadge> : null}
    </>
  );
}
