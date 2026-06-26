import type { SiteProfile } from '../../../_shared/siteConfig';

/** 关于页静态资料（API 未就绪时兜底，与简历及 DEFAULT_ABOUT 对齐） */
export const fallbackProfile: SiteProfile = {
  name: '王刘永',
  title: '前端开发工程师（6 年经验）',
  location: '中国 · 合肥',
  email: '1355498705@qq.com',
  github: 'https://github.com/wangliuyong',
  intro:
    '六年前端一线经验，专注中大型前端架构、工程化与跨端交付。熟悉微前端（Qiankun）、Monorepo 分层与模块边界治理，具备从用户场景与验收标准反推方案的产品思维，擅长将复杂业务抽象为稳定可维护的前端工程系统。',
  education: '安徽科技工程大学 · 本科 · 城乡规划 · 2014 — 2019',
  certifications: [],
  strengths: [
    '架构与工程化：具备中大型前端架构设计与落地能力，熟悉微前端（Qiankun）、Monorepo 分层与模块边界治理，兼顾可维护性与交付效率',
    '产品思维：习惯从用户场景与验收标准反推方案，参与需求拆解、MVP 边界划定与体验闭环设计，注重首屏性能与主题一致性',
    '技术广度：熟练掌握 JavaScript / TypeScript、HTML / CSS；精通 Vue 3 生态，熟悉 React 18、Next.js App Router；具备 NestJS 全栈协作经验',
    '跨端交付：熟练使用 UniApp 开发 H5、微信小程序及 App，具备多端统一交付、兼容性处理与性能优化实战经验',
    '组件与平台化：主导过企业级组件库从 0 到 1 建设，制定开发/发布规范，支撑多业务线复用',
    '构建与性能：熟悉 Vite / Webpack 工程配置，具备打包体积优化、按需加载、缓存策略等性能治理实践',
    '协作与规范：熟练使用 Git 进行版本管理与 Code Review，具备团队流程规范、文档沉淀与知识传递意识',
  ],
  experiences: [
    {
      period: '2021.05 — 至今',
      company: '深迪科技',
      role: '前端开发工程师',
      summary:
        '负责工业互联网平台及工业企业 SaaS 产品的前端模块设计、研发与架构演进；参与需求评审与技术方案讨论，主导前端技术调研与基础架构建设，封装 Vue 3 / Angular 通用组件与工具库；负责性能优化、跨端兼容与线上问题治理，推动组件化、类型化与工程化标准在团队内落地。',
    },
    {
      period: '2019.09 — 2021.04',
      company: '懂微信息技术（上海）有限公司',
      role: '前端开发工程师',
      summary:
        '负责公司官网及后台系统维护与功能迭代，独立完成多个 Web 前端模块的设计、开发与上线；参与前端技术选型与项目框架搭建，封装常用模块与数据处理函数，主导 NPM 公共仓库开发与维护；基于 UniApp 开发多个跨平台应用（小程序 / Android / iOS），实现多端统一开发与部署。',
    },
  ],
  skillGroups: [
    {
      title: '框架与工程化',
      description: '中大型前端架构、微前端拆分与工程体系建设。',
      items: [
        'Vue 3 / React 18',
        'TypeScript',
        'Next.js App Router',
        'Vite / Webpack',
        'Qiankun / Monorepo',
      ],
    },
    {
      title: '全栈与平台',
      description: '接口协作、后台治理与组件平台化交付。',
      items: ['NestJS', 'Prisma', 'REST API', 'RBAC 权限', '自研组件库 / NPM 仓库'],
    },
    {
      title: '跨端与部署',
      description: '多端统一交付与生产环境运维。',
      items: ['UniApp', '微信小程序', 'H5 / App', 'Docker', 'Nginx'],
    },
  ],
};
