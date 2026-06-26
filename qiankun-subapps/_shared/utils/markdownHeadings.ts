/** Markdown 标题节点，用于目录预览与锚点跳转 */
export interface MarkdownHeading {
  /** 标题层级，仅提取 h2 / h3 */
  level: 2 | 3;
  /** 纯文本标题（已去除 Markdown 行内标记） */
  text: string;
  /** 页面内锚点 id，与正文标题元素一致 */
  id: string;
}

/**
 * 将标题文本转为 URL 友好的 slug。
 * 保留中文与 ASCII 字母数字，其余替换为连字符。
 */
export function slugifyHeading(text: string): string {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return slug.slice(0, 80) || 'section';
}

/** 去除 Markdown 行内强调、代码等标记，得到可读纯文本 */
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

/**
 * 从 Markdown 源文本提取 h2 / h3 标题列表。
 * 按文档顺序生成唯一 id，供目录与正文锚点共用。
 */
export function extractMarkdownHeadings(content: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = [];
  const idCounts = new Map<string, number>();

  for (const line of content.split('\n')) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const text = stripInlineMarkdown(match[2]);
    const baseId = slugifyHeading(text);
    const seen = idCounts.get(baseId) ?? 0;
    idCounts.set(baseId, seen + 1);
    const id = seen === 0 ? baseId : `${baseId}-${seen}`;

    headings.push({ level, text, id });
  }

  return headings;
}

/**
 * 为 marked 输出的 HTML 注入与 extractMarkdownHeadings 一致的 id。
 * 按 h2 / h3 出现顺序依次匹配，保证 SSR 与客户端目录跳转一致。
 */
export function injectHeadingIdsIntoHtml(html: string, content: string): string {
  const headings = extractMarkdownHeadings(content);
  let index = 0;

  return html.replace(/<(h[23])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, inner) => {
    const heading = headings[index];
    index += 1;
    if (!heading) return match;

    const safeAttrs = attrs ?? '';
    if (/\sid=/.test(safeAttrs)) return match;

    return `<${tag} id="${heading.id}"${safeAttrs}>${inner}</${tag}>`;
  });
}
