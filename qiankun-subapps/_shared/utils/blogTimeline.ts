import type { Article } from '../contentTypes';
import { formatDate } from './format';

/** 博客列表默认展示用的日期格式（与 formatDate 默认 short 一致） */
export const BLOG_LIST_DATE_FORMAT = 'short' as const;

/**
 * 判断当前文章是否应展示发布时间。
 * 规则：与上一条展示日期相同则隐藏，仅保留该时间分组的第一个。
 */
export function shouldShowArticleDate(
  articles: Pick<Article, 'publishedAt'>[],
  index: number,
): boolean {
  if (index <= 0) return true;

  const current = formatDate(articles[index]?.publishedAt, BLOG_LIST_DATE_FORMAT);
  const previous = formatDate(articles[index - 1]?.publishedAt, BLOG_LIST_DATE_FORMAT);

  return current !== previous;
}
