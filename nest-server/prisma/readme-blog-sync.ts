import * as fs from 'fs';
import * as path from 'path';
import type { PrismaClient } from '@prisma/client';

/** README 同步到博客时使用的固定 slug */
export const README_BLOG_SLUG = 'project-readme';

/** 默认 README 路径：仓库根目录 */
const DEFAULT_README_PATH = path.resolve(__dirname, '../../README.md');

/**
 * 从 Markdown 首行提取 H1 标题
 * @param markdown 原始 Markdown
 */
function extractTitle(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? '项目 README';
}

/**
 * 提取 H1 后第一段非空文本作为摘要
 * @param markdown 原始 Markdown
 */
function extractSummary(markdown: string): string {
  const withoutH1 = markdown.replace(/^#\s+.+\n+/, '');
  const paragraph = withoutH1
    .split(/\n\n+/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith('#') && !block.startsWith('```'));
  if (!paragraph) return '项目 README 文档，与仓库保持同步。';
  return paragraph.replace(/\n/g, ' ').slice(0, 500);
}

/**
 * 去掉正文首个 H1，避免与博客详情页标题重复展示
 * @param markdown 原始 Markdown
 */
function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^#\s+.+\n+/, '').trimStart();
}

/**
 * 在正文顶部追加同步说明
 * @param body 去掉 H1 后的正文
 */
function wrapReadmeBody(body: string): string {
  const syncedAt = new Date().toISOString().slice(0, 10);
  return (
    `> 本文由仓库根目录 \`README.md\` 自动同步（${syncedAt}）。修改 README 后执行 \`pnpm run sync:readme:blog\` 更新。\n\n` +
    body
  );
}

/**
 * 读取 README 并构造博客文章字段
 * @param readmePath README 文件绝对路径
 */
export function buildReadmeArticlePayload(readmePath: string = DEFAULT_README_PATH) {
  if (!fs.existsSync(readmePath)) {
    throw new Error(`README 不存在: ${readmePath}`);
  }

  const raw = fs.readFileSync(readmePath, 'utf-8');
  const stat = fs.statSync(readmePath);
  const title = extractTitle(raw);
  const content = wrapReadmeBody(stripLeadingH1(raw));

  return {
    title,
    summary: extractSummary(raw),
    content,
    category: '项目文档',
    tags: 'README,Next.js,qiankun,NestJS,微前端,全栈',
    slug: README_BLOG_SLUG,
    /** 使用 README 文件修改时间作为发布时间，便于列表按更新排序 */
    publishedAt: stat.mtime,
  };
}

/**
 * 将项目 README 同步为博客文章（按 slug upsert，可重复执行）
 * @param prisma Prisma 客户端
 * @param readmePath 可选自定义 README 路径
 */
export async function syncReadmeToBlog(
  prisma: PrismaClient,
  readmePath?: string,
): Promise<{ id: number; title: string; slug: string }> {
  const payload = buildReadmeArticlePayload(readmePath);

  const article = await prisma.article.upsert({
    where: { slug: README_BLOG_SLUG },
    update: {
      title: payload.title,
      summary: payload.summary,
      content: payload.content,
      category: payload.category,
      tags: payload.tags,
      publishedAt: payload.publishedAt,
    },
    create: payload,
  });

  return { id: article.id, title: article.title, slug: article.slug ?? README_BLOG_SLUG };
}
