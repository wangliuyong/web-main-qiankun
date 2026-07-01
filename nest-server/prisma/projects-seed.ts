import type { PrismaClient } from '@prisma/client';

/** 作品集种子条目（按 name 去重 upsert，与简历项目经历对齐） */
export interface ProjectSeedItem {
  name: string;
  desc: string;
  techStack: string;
  /** personal 个人项目 | enterprise 企业项目 */
  category: 'personal' | 'enterprise';
  githubUrl?: string;
  previewUrl?: string;
}

/** 历史占位演示项目，同步时清理 */
const LEGACY_PLACEHOLDER_NAMES = ['组件库 Playground', '博客 Markdown 渲染器'];

/** 构建作品集种子数据 */
export function buildProjectSeedItems(): ProjectSeedItem[] {
  const origin = process.env.PUBLIC_ORIGIN || 'http://47.116.30.137';

  return [
    {
      name: '个人全能站点',
      category: 'personal',
      desc:
        '面向技术访客与潜在合作方的个人品牌站点，集博客、作品集、留言、友链与 AI 问答于一体；采用 Next.js 主基座 + Qiankun 微前端双子应用 + NestJS 统一 API，含 RBAC 管理后台与 RAG 知识库。',
      techStack:
        'Next.js, Qiankun, React, Vite, TypeScript, Tailwind, NestJS, Prisma, LanceDB, Docker, Nginx',
      githubUrl: 'https://github.com/wangliuyong',
      previewUrl: origin,
    },
    {
      name: '同城便民',
      category: 'personal',
      desc:
        '同城生活服务 C 端与管理后台，支持 H5 / 微信小程序 / APP 多端；含分类浏览、信息发布、收藏、举报、AI 助手与 RBAC 后台审核。',
      techStack: 'uni-app, Vue3, uview-plus, Pinia, NestJS, Prisma',
      previewUrl: `${origin}/convenience/`,
    },
    {
      name: '小画家启蒙',
      category: 'personal',
      desc:
        '面向 3–8 岁儿童的绘画启蒙 uni-app 应用，支持循序渐进课程、Canvas 绘画工作台、本地进度与作品集，预留后端 API 对接。',
      techStack: 'uni-app, Vue3, TypeScript, Pinia, Canvas',
      previewUrl: 'http://localhost:5176',
    },
    {
      name: 'XBOM 物料管理系统',
      category: 'enterprise',
      desc:
        '汽车生产物料数据管理系统，服务企业内部多条业务线；经历 Angular → Vue2 → Vue3 三次技术栈演进，含 Web 端与 UniApp 跨端应用。',
      techStack: 'Vue 3, TypeScript, UniApp, Vite, Angular, Webpack, Ithink-dt',
    },
    {
      name: 'Ithink-dt 前端公共组件库',
      category: 'enterprise',
      desc:
        '面向多业务线的前端组件库平台，提供表单、弹窗、表格、选择器等 30+ 通用组件；支撑 8+ 业务项目接入，组件复用率 70%+。',
      techStack: 'Vue 3, Naive UI, TypeScript, Less, Jest',
    },
  ];
}

/**
 * 同步作品集种子：按名称 upsert，清理历史占位项。
 * 已有记录时更新描述与技术栈，不删除用户手动新增的其他项目。
 */
export async function syncProjectsSeed(prisma: PrismaClient): Promise<number> {
  const items = buildProjectSeedItems();
  let synced = 0;

  for (const item of items) {
    const existing = await prisma.project.findFirst({ where: { name: item.name } });
    if (existing) {
      await prisma.project.update({
        where: { id: existing.id },
        data: {
          desc: item.desc,
          techStack: item.techStack,
          category: item.category,
          githubUrl: item.githubUrl ?? null,
          previewUrl: item.previewUrl ?? null,
        },
      });
    } else {
      await prisma.project.create({ data: item });
    }
    synced += 1;
  }

  // 移除早期演示占位项目
  await prisma.project.deleteMany({
    where: { name: { in: LEGACY_PLACEHOLDER_NAMES } },
  });

  return synced;
}
