/**
 * 独立执行：pnpm run sync:readme:blog
 * 将仓库根目录 README.md 同步到博客 Article 表
 */
import { PrismaClient } from '@prisma/client';
import { syncReadmeToBlog } from './readme-blog-sync';

const prisma = new PrismaClient();

async function main() {
  const result = await syncReadmeToBlog(prisma);
  console.log(
    `README synced to blog: id=${result.id}, slug=${result.slug}, title="${result.title}"`,
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
