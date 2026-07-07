import { BlogTimelineList } from '@shared/components';
import type { Article } from '@shared/contentTypes';
import { blogDetailPath } from '@/router';

export interface BlogArticleListProps {
  articles: Article[];
}

/** 博客文章列表（SSR 友好，使用原生 a 标签；相同日期仅首条展示时间） */
export default function BlogArticleList({ articles }: BlogArticleListProps) {
  return (
    <BlogTimelineList
      articles={articles}
      resolveHref={(id) => blogDetailPath(id)}
    />
  );
}
