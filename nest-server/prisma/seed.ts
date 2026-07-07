import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import {
  DEFAULT_ABOUT,
  DEFAULT_CONTACT,
  DEFAULT_NAV,
} from '../src/site/site.types';
import { seedRbac, ensureAdminSuperRole, syncRbacModules } from './rbac-seed';
import { seedConvenience } from './convenience-seed';
import {
  seedArticles,
  stripChecklistFromAllArticles,
  stripGeneratedSeedFooterFromAllArticles,
} from './articles-seed';
import { syncReadmeToBlog } from './readme-blog-sync';
import { syncProjectsSeed } from './projects-seed';
import { seedPageViews } from './page-views-seed';

const prisma = new PrismaClient();

async function main() {
  // 管理员账号（默认 admin / admin123，生产环境请修改 ADMIN_PASSWORD）
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = await bcrypt.hash(adminPassword, 10);
  const adminUser = await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: { password: hash },
    create: { username: 'admin', password: hash, nickname: '管理员', status: 1 },
  });

  // RBAC 菜单/权限/超管角色（仅 AdminModule 为空时初始化）
  await seedRbac(prisma, adminUser.id);
  await ensureAdminSuperRole(prisma, adminUser.id);
  // 增量同步新菜单（如 AI 小助手管理），并为超管补全权限
  await syncRbacModules(prisma);

  // 站点全局配置：已有记录时不覆盖（部署时保留后台修改的内容）
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: '王刘永的博客',
      githubUrl: 'https://github.com/wangliuyong',
      email: '1355498705@qq.com',
      navJson: JSON.stringify(DEFAULT_NAV),
      aboutJson: JSON.stringify(DEFAULT_ABOUT),
      contactJson: JSON.stringify(DEFAULT_CONTACT),
    },
  });

  // 增量同步关于页与联系页：与简历默认内容对齐（保留站点名称、导航等其余后台配置）
  await prisma.siteConfig.update({
    where: { id: 1 },
    data: {
      aboutJson: JSON.stringify(DEFAULT_ABOUT),
      contactJson: JSON.stringify(DEFAULT_CONTACT),
      email: DEFAULT_ABOUT.email,
      githubUrl: DEFAULT_ABOUT.github,
    },
  });

  // 演示数据仅在对应表为空时写入，避免重复部署清空生产数据
  const articleCount = await prisma.article.count();
  if (articleCount === 0) {
    await prisma.article.createMany({
    data: [
      {
        title: 'Next.js 与 Web Components 微前端实践',
        summary: '用 Lit 封装业务模块，Next 作主基座的轻量架构。',
        content:
          '# Next.js 与 Web Components\n\n本文介绍个人站点的微前端拆分方式。\n\n```ts\nconsole.log("hello wc");\n```',
        category: '前端',
        tags: 'Next.js,Web Components',
        slug: 'next-wc-microfrontend',
        publishedAt: new Date('2026-05-01'),
      },
      {
        title: 'NestJS + Prisma 快速搭建博客 API',
        summary: 'SQLite 本地开发，REST 接口供各子模块调用。',
        content: '# NestJS API\n\n使用 Prisma 管理文章、项目、留言与友链数据。',
        category: '后端',
        tags: 'NestJS,Prisma',
        slug: 'nestjs-prisma-api',
        publishedAt: new Date('2026-05-10'),
      },
      {
        title: '个人站点暗黑模式全链路',
        summary: 'next-themes 与 Shadow DOM 主题属性同步。',
        content: '# 暗黑模式\n\n主应用透传 `theme` 属性，子组件用 `:host([theme=dark])` 适配。',
        category: '前端',
        tags: 'CSS,主题',
        slug: 'dark-mode-sync',
        publishedAt: new Date('2026-05-20'),
      },
    ],
    });
  }

  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await syncProjectsSeed(prisma);
  }

  // 增量同步作品集：更新描述/技术栈，补全简历中的项目条目
  const projectSynced = await syncProjectsSeed(prisma);
  console.log(`Projects synced: ${projectSynced}`);

  const linkCount = await prisma.link.count();
  if (linkCount === 0) {
    await prisma.link.createMany({
    data: [
      {
        name: 'Next.js 文档',
        url: 'https://nextjs.org',
        description: 'React 全栈框架官方文档',
        sort: 1,
      },
      {
        name: 'Lit 官网',
        url: 'https://lit.dev',
        description: 'Web Components 开发框架',
        sort: 2,
      },
      {
        name: 'NestJS 文档',
        url: 'https://docs.nestjs.com',
        description: 'Node.js 服务端框架',
        sort: 3,
      },
    ],
    });
  }

  // app-web 本周访问 mock（仅库内无 SitePageView 时写入，供管理端热门页面统计演示）
  const pageViewsSeeded = await seedPageViews(prisma);
  console.log(`Page views seeded: ${pageViewsSeeded}`);

  // 同城便民 C 端演示用户与业务数据（用户与业务数据在 seedConvenience 内统一 upsert）
  await seedConvenience(prisma);

  // 博客：近 24 个月 × 每月 8~14 篇（按 slug upsert，不影响已有文章）
  const articleSeeded = await seedArticles(prisma);
  const checklistStripped = await stripChecklistFromAllArticles(prisma);
  const seedFooterStripped = await stripGeneratedSeedFooterFromAllArticles(prisma);
  console.log(`Articles seeded/updated: ${articleSeeded}`);
  console.log(`Launch checklist removed from ${checklistStripped} article(s)`);
  console.log(`Generated seed footer removed from ${seedFooterStripped} article(s)`);

  // 仓库 README 同步到博客（slug: project-readme）
  const readmeBlog = await syncReadmeToBlog(prisma);
  console.log(`README synced to blog: ${readmeBlog.slug} (#${readmeBlog.id})`);

  console.log('Seed completed (existing data preserved).');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
