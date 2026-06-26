/**
 * 根据 Markdown 正文估算阅读时长（中文技术博客场景）。
 * 规则：去除代码块与行内标记后按字符数计算，中文约 400 字/分钟。
 */

/** 去除 fenced code block，避免代码行拉高阅读时长 */
function stripCodeBlocks(content: string): string {
  return content.replace(/```[\s\S]*?```/g, ' ');
}

/** 去除 Markdown 行内标记，保留可读文字 */
function stripMarkdownInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 估算阅读分钟数，至少 1 分钟。
 * @param content - Markdown 源文本
 */
export function estimateReadMinutes(content: string): number {
  const plain = stripMarkdownInline(stripCodeBlocks(content));
  const charCount = plain.replace(/\s/g, '').length;
  const minutes = Math.ceil(charCount / 400);
  return Math.max(1, minutes);
}

/**
 * 格式化为掘金风格的阅读时长文案，如「阅读 12 分钟」。
 */
export function formatReadTime(content: string): string {
  return `阅读 ${estimateReadMinutes(content)} 分钟`;
}
