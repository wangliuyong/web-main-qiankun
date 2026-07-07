import type { Article } from '../contentTypes';
import { formatDate } from './format';

/** 时间轴：单月分组 */
export interface BlogTimelineMonthGroup {
  /** 唯一键，如 2024-10 */
  key: string;
  year: number;
  month: number;
  /** 展示标签，如 10月 */
  monthLabel: string;
  articles: Article[];
}

/** 时间轴：按年聚合 */
export interface BlogTimelineYearGroup {
  year: number;
  /** 展示标签，如 2024年 */
  yearLabel: string;
  months: BlogTimelineMonthGroup[];
}

/**
 * 将文章列表按发布时间分组为「年 → 月」时间轴结构。
 * 调用方应保证 articles 已按 publishedAt 降序排列。
 */
export function groupArticlesByTimeline(articles: Article[]): BlogTimelineYearGroup[] {
  const monthMap = new Map<string, BlogTimelineMonthGroup>();

  for (const article of articles) {
    const date = new Date(article.publishedAt);
    if (Number.isNaN(date.getTime())) continue;

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${year}-${String(month).padStart(2, '0')}`;

    if (!monthMap.has(key)) {
      monthMap.set(key, {
        key,
        year,
        month,
        monthLabel: formatDate(article.publishedAt, 'M月'),
        articles: [],
      });
    }

    monthMap.get(key)!.articles.push(article);
  }

  const yearMap = new Map<number, BlogTimelineYearGroup>();

  for (const monthGroup of Array.from(monthMap.values())) {
    if (!yearMap.has(monthGroup.year)) {
      yearMap.set(monthGroup.year, {
        year: monthGroup.year,
        yearLabel: `${monthGroup.year}年`,
        months: [],
      });
    }
    yearMap.get(monthGroup.year)!.months.push(monthGroup);
  }

  return Array.from(yearMap.values())
    .sort((a, b) => b.year - a.year)
    .map((yearGroup) => ({
      ...yearGroup,
      months: yearGroup.months.sort((a, b) => b.month - a.month),
    }));
}
