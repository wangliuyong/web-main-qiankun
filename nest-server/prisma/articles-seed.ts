import type { PrismaClient } from '@prisma/client';
import { generateArticleSeeds } from './articles-seed-data';

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
        content: article.content,
        category: article.category,
        tags: article.tags,
        publishedAt: article.publishedAt,
      },
      create: article,
    });
    upserted += 1;
  }

  return upserted;
}
