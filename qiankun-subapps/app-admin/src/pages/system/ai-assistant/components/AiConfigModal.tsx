import PermissionGuard from '../../../../components/PermissionGuard';
import {
  TechAlert,
  TechButton,
  TechInput,
  TechModal,
  TechNumberInput,
  TechPasswordInput,
  TechSelect,
} from '../../../../components/tech-ui';
import type { AiConfigResponse } from '../../../../api/ai.api';
import type { UseAiConfigResult } from '../hooks/useAiConfig';

export interface AiConfigModalProps {
  open: boolean;
  saving: boolean;
  loading: boolean;
  config: AiConfigResponse | null;
  formValues: UseAiConfigResult['formValues'];
  setFormField: UseAiConfigResult['setFormField'];
  isDashscope: boolean;
  dashscopeHint: UseAiConfigResult['dashscopeHint'];
  chatModelOptions: UseAiConfigResult['chatModelOptions'];
  embeddingModelOptions: UseAiConfigResult['embeddingModelOptions'];
  onClose: () => void;
  onSubmit: () => void;
  onEmbeddingModelChange: (model: string) => void;
  onBaseUrlChange: (url: string) => void;
}

/** AI 服务配置编辑弹窗 */
export default function AiConfigModal({
  open,
  saving,
  loading,
  config,
  formValues,
  setFormField,
  isDashscope,
  dashscopeHint,
  chatModelOptions,
  embeddingModelOptions,
  onClose,
  onSubmit,
  onEmbeddingModelChange,
  onBaseUrlChange,
}: AiConfigModalProps) {
  return (
    <TechModal
      open={open}
      title="AI 服务配置"
      width={560}
      onClose={() => !saving && onClose()}
      footer={
        <>
          <TechButton onClick={onClose} disabled={saving}>取消</TechButton>
          <PermissionGuard code="admin:ai-assistant:update">
            <TechButton variant="primary" loading={saving} onClick={onSubmit}>
              保存配置
            </TechButton>
          </PermissionGuard>
        </>
      }
    >
      {config?.fromEnv ? (
        <TechAlert
          type="info"
          message="当前 API Key 来自服务端环境变量"
          description="在此保存后将写入数据库并优先生效。"
        />
      ) : null}
      {!config?.hasApiKey && !loading ? (
        <TechAlert
          type="warning"
          message="尚未配置 API Key"
          description="请填写 API Key 与模型配置后保存，再进行数据源同步。"
        />
      ) : null}
      {isDashscope ? (
        <TechAlert
          type="info"
          message="通义千问推荐配置"
          description={`对话模型：${dashscopeHint.chatModel}；向量模型：${dashscopeHint.embeddingModel}；向量维度：${dashscopeHint.dimensions}`}
        />
      ) : null}

      <div className="ai-config-form">
        <TechInput
          label="OPENAI_BASE_URL"
          value={formValues.openaiBaseUrl}
          onChange={(e) => setFormField('openaiBaseUrl', e.target.value)}
          onBlur={(e) => onBaseUrlChange(e.target.value.trim())}
          placeholder="https://api.openai.com/v1"
          extra="通义千问：https://dashscope.aliyuncs.com/compatible-mode/v1"
        />
        <TechPasswordInput
          label="OPENAI_API_KEY"
          value={formValues.openaiApiKey}
          onChange={(e) => setFormField('openaiApiKey', e.target.value)}
          placeholder={config?.hasApiKey ? '留空保留原 Key' : 'sk-...'}
          extra={
            config?.apiKeyMasked
              ? `当前已配置：${config.apiKeyMasked}（留空则保留原 Key）`
              : '请输入百炼 / OpenAI 兼容 API Key'
          }
        />
        <TechSelect
          label="对话模型 OPENAI_CHAT_MODEL"
          value={formValues.openaiChatModel}
          options={chatModelOptions}
          placeholder="请选择对话模型"
          onChange={(v) => setFormField('openaiChatModel', v)}
          extra={isDashscope ? '通义千问对话模型' : 'OpenAI 兼容对话模型'}
        />
        <TechSelect
          label="向量模型 OPENAI_EMBEDDING_MODEL"
          value={formValues.openaiEmbeddingModel}
          options={embeddingModelOptions}
          placeholder="请选择向量模型"
          onChange={onEmbeddingModelChange}
          extra={
            isDashscope
              ? '通义向量模型，切换后自动更新推荐维度'
              : 'OpenAI 向量模型，切换后自动更新推荐维度'
          }
        />
        <TechNumberInput
          label="向量维度"
          value={formValues.embeddingDimensions}
          min={64}
          max={4096}
          onChange={(v) => setFormField('embeddingDimensions', v)}
          extra="通义 text-embedding-v3 默认 1024；OpenAI text-embedding-3-small 为 1536"
        />
      </div>
    </TechModal>
  );
}
