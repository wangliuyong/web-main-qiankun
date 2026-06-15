/** 助手消息末尾嵌入同城信息卡片的标记（持久化到 DB，前端/序列化层解析） */
export const CONV_INFO_CARDS_START = '[[CONV_INFO_CARDS]]';
export const CONV_INFO_CARDS_END = '[[/CONV_INFO_CARDS]]';

/** 将信息卡片 JSON 附加到助手纯文本末尾 */
export function encodeAssistantContent(text: string, relatedInfos: unknown[]): string {
  const trimmed = text.trim();
  if (!relatedInfos.length) return trimmed;
  return `${trimmed}\n${CONV_INFO_CARDS_START}${JSON.stringify(relatedInfos)}${CONV_INFO_CARDS_END}`;
}

/** 从助手消息中拆出展示文本与信息卡片 */
export function parseAssistantContent(content: string): {
  text: string;
  relatedInfos: Record<string, unknown>[];
} {
  const start = content.indexOf(CONV_INFO_CARDS_START);
  if (start === -1) {
    return { text: content, relatedInfos: [] };
  }

  const end = content.indexOf(CONV_INFO_CARDS_END, start);
  if (end === -1) {
    return { text: content.slice(0, start).trim(), relatedInfos: [] };
  }

  const text = content.slice(0, start).trim();
  const json = content.slice(start + CONV_INFO_CARDS_START.length, end);

  try {
    const parsed = JSON.parse(json) as unknown;
    return {
      text,
      relatedInfos: Array.isArray(parsed) ? (parsed as Record<string, unknown>[]) : [],
    };
  } catch {
    return { text: content.slice(0, start).trim(), relatedInfos: [] };
  }
}
