import type { ReactNode } from 'react';
import AiConfigModal from './components/AiConfigModal';
import AiConfigStatusTags from './components/AiConfigStatusTags';
import {
  useAiConfig as useAiConfigState,
  type UseAiConfigOptions,
  type UseAiConfigResult,
} from './hooks/useAiConfig';

export type { UseAiConfigOptions, UseAiConfigResult };

/**
 * AI 配置组合：状态标签 + 配置弹窗
 */
export function useAiConfigCard(options?: UseAiConfigOptions): Omit<UseAiConfigResult, 'formValues' | 'setFormField' | 'handleSubmit'> & {
  configStatus: ReactNode;
  modal: ReactNode;
  open: () => void;
} {
  const cfg = useAiConfigState(options);

  const configStatus = (
    <AiConfigStatusTags loading={cfg.loading} config={cfg.config} />
  );

  const modal = (
    <AiConfigModal
      open={cfg.modalOpen}
      saving={cfg.saving}
      loading={cfg.loading}
      config={cfg.config}
      formValues={cfg.formValues}
      setFormField={cfg.setFormField}
      isDashscope={cfg.isDashscope}
      dashscopeHint={cfg.dashscopeHint}
      chatModelOptions={cfg.chatModelOptions}
      embeddingModelOptions={cfg.embeddingModelOptions}
      onClose={cfg.closeModal}
      onSubmit={() => void cfg.handleSubmit()}
      onEmbeddingModelChange={cfg.handleEmbeddingModelChange}
      onBaseUrlChange={cfg.handleBaseUrlChange}
    />
  );

  return { ...cfg, configStatus, modal };
}

/** @deprecated 使用 useAiConfigCard */
export const useAiConfig = useAiConfigCard;
