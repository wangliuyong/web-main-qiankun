'use client';

import { ArticleEngagementPanel } from '@shared/components';
import { API_BASE } from '@/utils/api';

export interface BlogEngagementSectionProps {
  articleId: number;
  articleTitle: string;
}

/** next-host 博客详情互动区客户端包装 */
export function BlogEngagementSection({
  articleId,
  articleTitle,
}: BlogEngagementSectionProps) {
  return (
    <ArticleEngagementPanel
      apiBase={API_BASE}
      articleId={articleId}
      articleTitle={articleTitle}
    />
  );
}
