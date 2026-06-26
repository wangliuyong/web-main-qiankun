import {
  AppLink,
  ArticleMarkdown,
  ArticleToc,
  PageTitle,
  SubApp,
} from '../../../../../_shared/components';
import { formatDate } from '../../../../../_shared/utils';
import { extractMarkdownHeadings } from '../../../../../_shared/utils/markdownHeadings';
import type { Article } from '../../../../../_shared/contentTypes';

export interface BlogDetailViewProps {
  article: Article;
}

/** 博客文章详情视图 */
export default function BlogDetailView({ article }: BlogDetailViewProps) {
  const headings = extractMarkdownHeadings(article.content);

  return (
    <SubApp className="article-detail-layout">
      <ArticleToc headings={headings} />

      <article className="article-detail-layout__main">
        <AppLink href="/blog" variant="back" className="mb-4 app-back-link">
          返回列表
        </AppLink>
        <PageTitle className="mb-0">{article.title}</PageTitle>

        <p className="text-sm text-faint my-2 app-section">
          {formatDate(article.publishedAt)}
          {article.category ? ` · ${article.category}` : ''}
        </p>
        <ArticleMarkdown className="app-article-body" content={article.content} />
      </article>
    </SubApp>
  );
}
