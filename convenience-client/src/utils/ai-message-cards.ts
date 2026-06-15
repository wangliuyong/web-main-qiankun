import type { CityInfoItem } from '@/types/city-info';
import { resolveMediaUrls } from '@/utils/media';

/** 与后端 conv-ai-message.util 保持一致 */
export const CONV_INFO_CARDS_START = '[[CONV_INFO_CARDS]]';
export const CONV_INFO_CARDS_END = '[[/CONV_INFO_CARDS]]';

/** 解析助手消息：展示文本 + 同城信息卡片 */
export function parseAiAssistantMessage(content: string): {
  text: string;
  relatedInfos: CityInfoItem[];
} {
  const start = content.indexOf(CONV_INFO_CARDS_START);
  if (start === -1) {
    return { text: content, relatedInfos: [] };
  }

  const end = content.indexOf(CONV_INFO_CARDS_END, start);
  const text = (end === -1 ? content.slice(0, start) : content.slice(0, start)).trim();

  if (end === -1) {
    return { text, relatedInfos: [] };
  }

  const json = content.slice(start + CONV_INFO_CARDS_START.length, end);
  try {
    const parsed = JSON.parse(json) as CityInfoItem[];
    if (!Array.isArray(parsed)) return { text, relatedInfos: [] };
    return {
      text,
      relatedInfos: parsed.map((item) => ({
        ...item,
        images: resolveMediaUrls(item.images || []),
      })),
    };
  } catch {
    return { text, relatedInfos: [] };
  }
}

/** 合并 API 返回的 relatedInfos 与 content 内嵌卡片（API 字段优先） */
export function resolveAiMessageCards(
  content: string,
  relatedInfos?: CityInfoItem[],
): { text: string; relatedInfos: CityInfoItem[] } {
  const parsed = parseAiAssistantMessage(content);
  const cards = relatedInfos?.length ? relatedInfos : parsed.relatedInfos;
  return {
    text: parsed.text,
    relatedInfos: cards.map((item) => ({
      ...item,
      images: resolveMediaUrls(item.images || []),
    })),
  };
}
