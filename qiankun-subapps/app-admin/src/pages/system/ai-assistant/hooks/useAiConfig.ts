import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AI_CONFIG_KEY_PLACEHOLDER,
  getAiConfig,
  updateAiConfig,
  type AiConfigResponse,
  type UpdateAiConfigPayload,
} from '../../../../api/ai.api';
import { techToast } from '../../../../components/tech-ui';
import {
  getChatModelOptions,
  getEmbeddingModelOptions,
  inferEmbeddingDimensions,
  isDashscopeBaseUrl,
  mergeCurrentModelOption,
} from '../aiModelOptions';

export interface AiConfigFormValues {
  openaiBaseUrl: string;
  openaiApiKey: string;
  openaiChatModel: string;
  openaiEmbeddingModel: string;
  embeddingDimensions: number;
}

const EMPTY_FORM: AiConfigFormValues = {
  openaiBaseUrl: '',
  openaiApiKey: '',
  openaiChatModel: '',
  openaiEmbeddingModel: '',
  embeddingDimensions: 1536,
};

/** 通义千问推荐配置提示文案 */
const DASHSCOPE_HINT = {
  chatModel: 'qwen-plus',
  embeddingModel: 'text-embedding-v3',
  dimensions: 1024,
};

export interface UseAiConfigOptions {
  onSaved?: () => void;
}

export interface UseAiConfigResult {
  open: () => void;
  loading: boolean;
  saving: boolean;
  modalOpen: boolean;
  config: AiConfigResponse | null;
  formValues: AiConfigFormValues;
  setFormField: <K extends keyof AiConfigFormValues>(key: K, value: AiConfigFormValues[K]) => void;
  isDashscope: boolean;
  dashscopeHint: typeof DASHSCOPE_HINT;
  chatModelOptions: ReturnType<typeof getChatModelOptions>;
  embeddingModelOptions: ReturnType<typeof getEmbeddingModelOptions>;
  handleSubmit: () => Promise<void>;
  handleEmbeddingModelChange: (model: string) => void;
  handleBaseUrlChange: (url: string) => void;
  closeModal: () => void;
}

/**
 * AI 服务配置：拉取/保存 API Key、模型与向量维度
 */
export function useAiConfig({ onSaved }: UseAiConfigOptions = {}): UseAiConfigResult {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [config, setConfig] = useState<AiConfigResponse | null>(null);
  const [formValues, setFormValues] = useState<AiConfigFormValues>(EMPTY_FORM);

  const applyConfigToForm = useCallback((data: AiConfigResponse) => {
    setFormValues({
      openaiBaseUrl: data.openaiBaseUrl,
      openaiApiKey: data.hasApiKey ? AI_CONFIG_KEY_PLACEHOLDER : '',
      openaiChatModel: data.openaiChatModel,
      openaiEmbeddingModel: data.openaiEmbeddingModel,
      embeddingDimensions: data.embeddingDimensions,
    });
  }, []);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAiConfig();
      setConfig(data);
      applyConfigToForm(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, [applyConfigToForm]);

  useEffect(() => {
    void fetchConfig();
  }, [fetchConfig]);

  const open = useCallback(() => {
    setModalOpen(true);
    void fetchConfig();
  }, [fetchConfig]);

  const setFormField = <K extends keyof AiConfigFormValues>(key: K, value: AiConfigFormValues[K]) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formValues.openaiBaseUrl.trim()) {
      techToast.warning('请输入 API Base URL');
      return;
    }
    if (!formValues.openaiChatModel.trim()) {
      techToast.warning('请选择对话模型');
      return;
    }

    setSaving(true);
    try {
      const payload: UpdateAiConfigPayload = {
        openaiBaseUrl: formValues.openaiBaseUrl.trim(),
        openaiChatModel: formValues.openaiChatModel.trim(),
        openaiEmbeddingModel: formValues.openaiEmbeddingModel.trim(),
        embeddingDimensions: formValues.embeddingDimensions,
      };
      const key = formValues.openaiApiKey?.trim();
      if (key && key !== AI_CONFIG_KEY_PLACEHOLDER) {
        payload.openaiApiKey = key;
      } else if (!config?.hasApiKey && key) {
        payload.openaiApiKey = key;
      }

      const next = await updateAiConfig(payload);
      setConfig(next);
      applyConfigToForm(next);
      techToast.success('AI 配置已保存');
      setModalOpen(false);
      onSaved?.();
    } finally {
      setSaving(false);
    }
  };

  const baseUrl = formValues.openaiBaseUrl || config?.openaiBaseUrl || '';
  const isDashscope = isDashscopeBaseUrl(baseUrl);

  const chatModelOptions = useMemo(
    () => mergeCurrentModelOption(getChatModelOptions(baseUrl), formValues.openaiChatModel),
    [baseUrl, formValues.openaiChatModel],
  );

  const embeddingModelOptions = useMemo(
    () => mergeCurrentModelOption(getEmbeddingModelOptions(baseUrl), formValues.openaiEmbeddingModel),
    [baseUrl, formValues.openaiEmbeddingModel],
  );

  const handleEmbeddingModelChange = (model: string) => {
    setFormField('openaiEmbeddingModel', model);
    setFormField('embeddingDimensions', inferEmbeddingDimensions(model));
  };

  const handleBaseUrlChange = (url: string) => {
    const chatOpts = getChatModelOptions(url);
    const embedOpts = getEmbeddingModelOptions(url);
    const patch: Partial<AiConfigFormValues> = {};
    if (formValues.openaiChatModel && !chatOpts.some((o) => o.value === formValues.openaiChatModel)) {
      patch.openaiChatModel = chatOpts[0]?.value ?? '';
    }
    if (formValues.openaiEmbeddingModel && !embedOpts.some((o) => o.value === formValues.openaiEmbeddingModel)) {
      patch.openaiEmbeddingModel = embedOpts[0]?.value ?? '';
      patch.embeddingDimensions = inferEmbeddingDimensions(embedOpts[0]?.value ?? '');
    }
    if (Object.keys(patch).length) {
      setFormValues((prev) => ({ ...prev, ...patch }));
    }
  };

  return {
    open,
    loading,
    saving,
    modalOpen,
    config,
    formValues,
    setFormField,
    isDashscope,
    dashscopeHint: DASHSCOPE_HINT,
    chatModelOptions,
    embeddingModelOptions,
    handleSubmit,
    handleEmbeddingModelChange,
    handleBaseUrlChange,
    closeModal: () => setModalOpen(false),
  };
}
