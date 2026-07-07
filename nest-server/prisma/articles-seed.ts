import type { PrismaClient } from '@prisma/client';
import { generateArticleSeeds } from './articles-seed-data';
import {
  sanitizeArticleContent,
  stripGeneratedSeedFooter,
  stripLaunchChecklistSection,
} from './articles-seed-content';

/**
 * 批量移除数据库中仍含「上线前 Checklist」段落的博客正文
 */
export async function stripChecklistFromAllArticles(prisma: PrismaClient): Promise<number> {
  const articles = await prisma.article.findMany({
    where: { content: { contains: '## 上线前 Checklist' } },
    select: { id: true, content: true },
  });

  let updated = 0;
  for (const article of articles) {
    const content = stripLaunchChecklistSection(article.content);
    if (content === article.content) continue;
    await prisma.article.update({
      where: { id: article.id },
      data: { content },
    });
    updated += 1;
  }

  return updated;
}

/**
 * 批量移除数据库中仍含「*Generated seed article*」页脚的博客正文
 */
export async function stripGeneratedSeedFooterFromAllArticles(
  prisma: PrismaClient,
): Promise<number> {
  const articles = await prisma.article.findMany({
    where: { content: { contains: 'Generated seed article' } },
    select: { id: true, content: true },
  });

  let updated = 0;
  for (const article of articles) {
    const content = stripGeneratedSeedFooter(article.content);
    if (content === article.content) continue;
    await prisma.article.update({
      where: { id: article.id },
      data: { content },
    });
    updated += 1;
  }

  return updated;
}

/**
 * 写入博客种子数据（按 slug upsert，可重复执行）
 * 近 24 个月 × 每月随机 8~14 篇，详细 Markdown 正文
 */
export async function seedArticles(prisma: PrismaClient): Promise<number> {
  const seeds = generateArticleSeeds();
  let upserted = 0;

  for (const article of seeds) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        summary: article.summary,
        content: sanitizeArticleContent(article.content),
        category: article.category,
        tags: article.tags,
        publishedAt: article.publishedAt,
      },
      create: {
        ...article,
        content: sanitizeArticleContent(article.content),
      },
    });
    upserted += 1;
  }

  return upserted;
}
