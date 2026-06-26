/**
 * 独立执行：pnpm --dir nest-server exec ts-node prisma/seed-articles.ts
 * 或在根目录：pnpm run db:seed:articles
 */
import { PrismaClient } from '@prisma/client';
import { seedArticles, stripChecklistFromAllArticles } from './articles-seed';
import { syncReadmeToBlog } from './readme-blog-sync';

const prisma = new PrismaClient();

async function main() {
  const count = await seedArticles(prisma);
  const stripped = await stripChecklistFromAllArticles(prisma);
  const readme = await syncReadmeToBlog(prisma);
  const total = await prisma.article.count();
  console.log(`Articles seed completed: upserted ${count} records, total ${total} in database.`);
  console.log(`Removed launch checklist from ${stripped} article(s).`);
  console.log(`README synced: ${readme.slug} (#${readme.id})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
