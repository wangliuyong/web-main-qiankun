/**
 * 博客种子数据：全栈偏前端架构主题
 * 近 24 个月（2024-07 ~ 2026-06），每月随机 8~14 篇，正文为详细长文
 */

import { buildDetailedMarkdownContent } from './articles-seed-content';
import {
  buildPublishedDates,
  buildSlug,
  expandPostsForMonth,
  getMonthPostCount,
  resolveCategory,
  type PostTemplate,
} from './articles-seed-generators';

/** 单篇博客种子结构 */
export interface ArticleSeedItem {
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string;
  slug: string;
  publishedAt: Date;
}

/** 每月主题与基础文章模板（每主题至少 4 篇，运行时会扩展至 8+） */
interface MonthTheme {
  /** 年月，如 2024-07 */
  yearMonth: string;
  /** 当月技术主题 */
  theme: string;
  /** 基础文章列表 */
  posts: PostTemplate[];
}

/** 24 个月主题库 */
const MONTH_THEMES: MonthTheme[] = [
  {
    yearMonth: '2024-07',
    theme: 'React Server Components',
    posts: [
      {
        title: 'React Server Components 入门：何时该用 RSC',
        summary: '从客户端/服务端组件边界出发，梳理 RSC 适用场景与常见误区。',
        tags: 'React,RSC,Next.js',
        sections: ['RSC 解决的核心问题', '与 SSR 的区别', '数据获取模式', '实践 checklist'],
      },
      {
        title: 'App Router 下的布局与嵌套路由设计',
        summary: '用 layout.tsx 构建可复用壳层，讨论并行路由与拦截路由的取舍。',
        tags: 'Next.js,App Router,架构',
        sections: ['Layout 组合策略', '路由组 route groups', 'loading/error 边界', 'SEO 与 metadata'],
      },
      {
        title: 'Streaming SSR 与 Suspense 协作模式',
        summary: 'Streaming 如何改善 TTFB 与首屏体验，Suspense 边界如何划分。',
        tags: 'React,Suspense,性能',
        sections: ['Streaming 原理', 'Suspense 边界设计', '骨架屏策略', '监控指标'],
      },
      {
        title: 'Server Actions 替代传统 BFF 的可行性分析',
        summary: '对比 Server Actions 与独立 BFF 层在表单、鉴权、错误处理上的差异。',
        tags: 'Next.js,Server Actions,全栈',
        sections: ['Server Actions 工作流', '与 REST 对比', '鉴权与 CSRF', '迁移路径'],
      },
    ],
  },
  {
    yearMonth: '2024-08',
    theme: '微前端架构',
    posts: [
      {
        title: 'qiankun 与 Module Federation 选型指南',
        summary: '从团队规模、技术栈异构程度、部署独立性等维度对比两种微前端方案。',
        tags: '微前端,qiankun,Module Federation',
        sections: ['方案对比矩阵', '运行时集成 vs 构建时集成', '样式隔离', '路由与通信'],
      },
      {
        title: '主应用如何设计子应用注册与生命周期',
        summary: 'registerMicroApps、start 与沙箱配置的最佳实践与踩坑记录。',
        tags: 'qiankun,微前端,工程化',
        sections: ['注册表设计', '生命周期钩子', 'JS/CSS 沙箱', '预加载策略'],
      },
      {
        title: '微前端下的公共依赖与版本治理',
        summary: 'React/Vue 多版本共存、shared 配置与 externals 策略。',
        tags: '微前端,依赖管理,Webpack',
        sections: ['共享依赖策略', '版本锁定', '构建配置', '升级流程'],
      },
      {
        title: '子应用独立开发与联调环境搭建',
        summary: '本地 standalone 模式、代理转发与环境变量约定。',
        tags: '微前端,DevOps,联调',
        sections: ['独立启动脚本', 'CORS 与代理', '环境变量规范', 'CI 集成'],
      },
    ],
  },
  {
    yearMonth: '2024-09',
    theme: 'TypeScript 工程化',
    posts: [
      {
        title: 'TypeScript 5.x 在大型前端项目中的配置策略',
        summary: 'strict 模式、paths 别名与 project references 的推荐组合。',
        tags: 'TypeScript,工程化,配置',
        sections: ['tsconfig 分层', 'strict 渐进启用', 'paths 与 bundler', '类型检查 CI'],
      },
      {
        title: '泛型工具类型实战：从 Partial 到自定义 Mapped Types',
        summary: '用类型体操提升 API 层与表单层的类型安全。',
        tags: 'TypeScript,泛型,类型体操',
        sections: ['内置工具类型', 'Mapped Types', '条件类型', '实战案例'],
      },
      {
        title: '前后端 DTO 类型共享的三种方案',
        summary: 'OpenAPI 生成、共享包与 Zod 运行时校验的对比。',
        tags: 'TypeScript,DTO,全栈',
        sections: ['OpenAPI codegen', 'monorepo 共享包', 'Zod 校验', '选型建议'],
      },
      {
        title: 'any 逃逸与类型断言的代码审查清单',
        summary: '团队 Code Review 中如何减少类型债务累积。',
        tags: 'TypeScript,Code Review,质量',
        sections: ['常见 any 来源', '断言替代方案', 'eslint 规则', '重构策略'],
      },
    ],
  },
  {
    yearMonth: '2024-10',
    theme: '构建与打包',
    posts: [
      {
        title: 'Vite 7 构建性能调优：依赖预构建与分包',
        summary: 'optimizeDeps、manualChunks 与 rollup 插件链优化经验。',
        tags: 'Vite,构建,性能',
        sections: ['冷启动分析', '预构建配置', '代码分割', '产物分析'],
      },
      {
        title: '从 Webpack 迁移到 Vite 的渐进式路径',
        summary: '共存期双构建、别名与环境变量对齐、测试链路改造。',
        tags: 'Vite,Webpack,迁移',
        sections: ['迁移评估', '配置对照', '测试适配', '灰度切换'],
      },
      {
        title: 'Library Mode 打包 React 组件库',
        summary: 'external、dts 生成与 peerDependencies 约定。',
        tags: 'Vite,组件库,打包',
        sections: ['library 配置', '类型声明', '多格式输出', '发布流程'],
      },
      {
        title: 'esbuild 与 SWC 在 CI 中的选型',
        summary: '编译速度、插件生态与 NestJS/Next 默认工具链的关系。',
        tags: 'esbuild,SWC,CI',
        sections: ['工具对比', 'NestJS 集成', 'Next 编译链', 'CI 耗时优化'],
      },
    ],
  },
  {
    yearMonth: '2024-11',
    theme: 'Vue 3 生态',
    posts: [
      {
        title: 'Vue 3.5 响应式系统变更对业务代码的影响',
        summary: 'ref/reactive 最佳实践与 watchEffect 使用边界。',
        tags: 'Vue3,响应式,Composition API',
        sections: ['响应式原理回顾', '3.5 变更点', '组合式函数模式', '性能注意点'],
      },
      {
        title: 'Pinia 状态模块化与 SSR 注水',
        summary: 'store 拆分、持久化插件与服务端 state 同步。',
        tags: 'Vue3,Pinia,SSR',
        sections: ['Store 模块设计', '持久化策略', 'SSR 注水', '类型推导'],
      },
      {
        title: 'Vue Router 4 与微前端路由协同',
        summary: 'history 模式、base 路径与子应用路由前缀约定。',
        tags: 'Vue3,Vue Router,微前端',
        sections: ['路由模式选择', 'base 配置', '守卫设计', '与主应用协同'],
      },
      {
        title: 'uni-app Vue3 跨端架构要点',
        summary: '条件编译、API 抽象层与样式适配策略。',
        tags: 'Vue3,uni-app,跨端',
        sections: ['条件编译', 'API 封装', '样式适配', '性能优化'],
      },
    ],
  },
  {
    yearMonth: '2024-12',
    theme: 'Monorepo 工程化',
    posts: [
      {
        title: 'pnpm workspace 目录结构与依赖边界',
        summary: 'apps/packages 划分、workspace 协议与 internal 包发布。',
        tags: 'Monorepo,pnpm,工程化',
        sections: ['目录规范', '依赖边界', 'workspace 协议', '版本管理'],
      },
      {
        title: 'Turborepo 任务编排与远程缓存',
        summary: 'pipeline 定义、缓存键与 CI 加速实践。',
        tags: 'Turborepo,Monorepo,CI',
        sections: ['pipeline 配置', '缓存策略', '远程缓存', 'CI 集成'],
      },
      {
        title: '共享 UI 包在 React 与 Vue 子应用间的复用',
        summary: 'Web Components 作为技术栈无关层的实践。',
        tags: 'Monorepo,Web Components,复用',
        sections: ['跨框架复用难题', 'WC 封装', '主题透传', '版本同步'],
      },
      {
        title: 'Changesets 版本发布与 changelog 自动化',
        summary: '多包 semver、预发布与 npm 私有源配置。',
        tags: 'Monorepo,Changesets,发布',
        sections: ['Changesets 工作流', 'semver 策略', 'changelog 生成', '私有源'],
      },
    ],
  },
  {
    yearMonth: '2025-01',
    theme: 'Next.js 全栈',
    posts: [
      {
        title: 'Next.js 中间件：鉴权、重定向与国际化',
        summary: 'middleware.ts 匹配规则与 Edge Runtime 限制。',
        tags: 'Next.js,中间件,鉴权',
        sections: ['matcher 配置', 'JWT 校验', 'i18n 路由', 'Edge 限制'],
      },
      {
        title: 'Route Handlers 设计 RESTful API 的模块划分',
        summary: 'app/api 目录组织、错误码约定与 OpenAPI 文档生成。',
        tags: 'Next.js,API,REST',
        sections: ['目录结构', '错误处理', '验证层', 'OpenAPI'],
      },
      {
        title: 'Next.js + Prisma 全栈项目的分层架构',
        summary: 'Service/Repository 分层与 Server Component 数据访问边界。',
        tags: 'Next.js,Prisma,架构',
        sections: ['分层设计', '数据访问边界', '事务处理', '测试策略'],
      },
      {
        title: '静态导出 vs Node 部署：个人站点的部署选型',
        summary: 'output export 适用场景与动态功能的权衡。',
        tags: 'Next.js,部署,SSG',
        sections: ['部署模式对比', '动态功能限制', 'Docker 部署', 'CDN 缓存'],
      },
    ],
  },
  {
    yearMonth: '2025-02',
    theme: 'NestJS 后端架构',
    posts: [
      {
        title: 'NestJS 模块化：Feature Module 与 Shared Module',
        summary: '模块边界、循环依赖与 forwardRef 使用原则。',
        tags: 'NestJS,模块化,架构',
        sections: ['模块划分原则', 'Shared Module', '循环依赖', '动态模块'],
      },
      {
        title: 'DTO 校验与 class-validator 最佳实践',
        summary: 'ValidationPipe 全局配置、自定义装饰器与错误响应格式。',
        tags: 'NestJS,DTO,校验',
        sections: ['ValidationPipe', '自定义装饰器', '错误格式', '分组校验'],
      },
      {
        title: 'NestJS 守卫、拦截器与过滤器职责划分',
        summary: '鉴权 Guard、日志 Interceptor、异常 Filter 的组合模式。',
        tags: 'NestJS,中间件,架构',
        sections: ['Guard 鉴权', 'Interceptor 横切', 'Exception Filter', '执行顺序'],
      },
      {
        title: 'NestJS 配置模块与环境变量管理',
        summary: 'ConfigModule、Joi 校验与多环境 .env 策略。',
        tags: 'NestJS,配置,DevOps',
        sections: ['ConfigModule', '环境校验', '多环境文件', '密钥管理'],
      },
    ],
  },
  {
    yearMonth: '2025-03',
    theme: '数据层与 Prisma',
    posts: [
      {
        title: 'Prisma Schema 建模：关系、索引与迁移策略',
        summary: '一对一/多对多建模、@@index 与 migrate dev 工作流。',
        tags: 'Prisma,数据库,建模',
        sections: ['关系建模', '索引设计', '迁移工作流', '种子数据'],
      },
      {
        title: 'Prisma Client 扩展与软删除中间件',
        summary: 'client.$extends 实现审计字段、软删除与多租户过滤。',
        tags: 'Prisma,中间件,架构',
        sections: ['Client 扩展', '软删除模式', '审计字段', '多租户'],
      },
      {
        title: 'SQLite 开发、PostgreSQL 生产的平滑切换',
        summary: 'provider 切换、类型差异与连接池配置。',
        tags: 'Prisma,SQLite,PostgreSQL',
        sections: ['环境差异', '迁移注意点', '连接池', '备份策略'],
      },
      {
        title: 'NestJS + Prisma 事务与并发控制',
        summary: 'interactive transaction、乐观锁与幂等设计。',
        tags: 'Prisma,NestJS,事务',
        sections: ['事务 API', '乐观锁', '幂等键', '并发场景'],
      },
    ],
  },
  {
    yearMonth: '2025-04',
    theme: '样式与 UI 架构',
    posts: [
      {
        title: 'Tailwind CSS 4 与设计令牌体系',
        summary: '@theme 变量、暗色模式与组件库主题扩展。',
        tags: 'Tailwind,CSS,设计系统',
        sections: ['设计令牌', '暗色模式', '组件变体', '与 UI 库集成'],
      },
      {
        title: 'CSS Modules vs CSS-in-JS：2025 年如何选型',
        summary: 'RSC 环境下 styled-components 的局限与替代方案。',
        tags: 'CSS,CSS Modules,架构',
        sections: ['方案对比', 'RSC 影响', '性能考量', '团队规范'],
      },
      {
        title: 'Shadow DOM 内样式隔离与主题同步',
        summary: 'Web Components 场景下 :host 与 CSS 变量透传。',
        tags: 'Web Components,CSS,主题',
        sections: ['Shadow DOM 隔离', 'CSS 变量', '主题同步', '第三方样式'],
      },
      {
        title: 'Ant Design / shadcn 在企业项目中的组合使用',
        summary: '基础组件与 headless 层分工，避免样式冲突。',
        tags: 'UI组件,Ant Design,shadcn',
        sections: ['组件分层', '样式冲突', '按需加载', '定制主题'],
      },
    ],
  },
  {
    yearMonth: '2025-05',
    theme: '状态管理',
    posts: [
      {
        title: 'Zustand 轻量状态 vs Redux Toolkit 复杂业务',
        summary: '选型矩阵：中间件、DevTools 与持久化需求。',
        tags: 'Zustand,Redux,状态管理',
        sections: ['选型矩阵', 'Zustand 模式', 'RTK 适用场景', '迁移成本'],
      },
      {
        title: 'React Query 服务端状态与客户端状态边界',
        summary: '缓存、失效、乐观更新与 Zustand 协作。',
        tags: 'React Query,TanStack,状态管理',
        sections: ['状态分类', '缓存策略', '乐观更新', '与 UI 状态协作'],
      },
      {
        title: 'Jotai 原子化状态在表单场景的实践',
        summary: '细粒度订阅、derived atom 与性能优势。',
        tags: 'Jotai,React,状态管理',
        sections: ['原子模型', 'derived atom', '表单场景', '性能对比'],
      },
      {
        title: '微前端跨应用状态：CustomEvent 与 Shared Worker',
        summary: '主子应用通信的状态同步模式对比。',
        tags: '微前端,状态同步,架构',
        sections: ['通信方式对比', 'CustomEvent', '全局 Store', '安全边界'],
      },
    ],
  },
  {
    yearMonth: '2025-06',
    theme: 'Web Components',
    posts: [
      {
        title: 'Lit 3 组件开发：属性、事件与样式',
        summary: '@property、@state 与 dispatchEvent 约定。',
        tags: 'Lit,Web Components,前端',
        sections: ['Lit 基础', '属性反射', '事件约定', '样式封装'],
      },
      {
        title: 'React 封装 Web Components 的互操作陷阱',
        summary: 'ref、事件命名与受控组件模式的差异。',
        tags: 'React,Web Components,互操作',
        sections: ['属性 vs 属性', '事件绑定', 'ref 访问', '受控模式'],
      },
      {
        title: 'Vite 打包 Web Components 库的生产配置',
        summary: '自定义元素注册、Tree Shaking 与 CDN 发布。',
        tags: 'Vite,Web Components,打包',
        sections: ['构建配置', '自定义元素', '按需加载', 'CDN 部署'],
      },
      {
        title: 'Web Components 在微前端中的角色定位',
        summary: '作为共享组件层连接 React/Vue 子应用。',
        tags: 'Web Components,微前端,架构',
        sections: ['定位分析', '集成方式', '版本管理', '性能考量'],
      },
    ],
  },
  {
    yearMonth: '2025-07',
    theme: '性能优化',
    posts: [
      {
        title: 'Core Web Vitals 优化实战：LCP、INP、CLS',
        summary: '指标含义、测量工具与常见优化手段清单。',
        tags: '性能,Core Web Vitals,优化',
        sections: ['三大指标', '测量工具', 'LCP 优化', 'INP/CLS 治理'],
      },
      {
        title: 'React 重渲染治理：memo、useMemo 与状态拆分',
        summary: '何时过度优化，Profiler 驱动的优化流程。',
        tags: 'React,性能,渲染',
        sections: ['重渲染分析', 'memo 策略', '状态拆分', 'Profiler 实践'],
      },
      {
        title: '图片与字体加载策略',
        summary: 'next/image、font-display 与 preload 优先级。',
        tags: '性能,资源加载,Next.js',
        sections: ['图片优化', '字体策略', 'preload/prefetch', 'CDN 配置'],
      },
      {
        title: '长列表虚拟滚动：react-window 与自研方案',
        summary: '动态高度、滚动恢复与移动端体验。',
        tags: '性能,虚拟滚动,React',
        sections: ['虚拟滚动原理', '库选型', '动态高度', '滚动恢复'],
      },
    ],
  },
  {
    yearMonth: '2025-08',
    theme: '渲染模式',
    posts: [
      {
        title: 'SSR、SSG、ISR、CSR 全面对比与选型',
        summary: '按页面类型划分渲染策略的决策树。',
        tags: 'SSR,SSG,ISR,架构',
        sections: ['四种模式', '决策树', '缓存策略', '混合渲染'],
      },
      {
        title: 'Next.js ISR 与 on-demand revalidation',
        summary: 'revalidate 时间、Tag 失效与 Webhook 触发。',
        tags: 'Next.js,ISR,缓存',
        sections: ['ISR 配置', 'Tag 失效', 'Webhook', '监控'],
      },
      {
        title: '客户端 Hydration 失败排查指南',
        summary: '水合不匹配常见原因与 suppressHydrationWarning 慎用场景。',
        tags: 'SSR,Hydration,React',
        sections: ['不匹配原因', '排查工具', '修复模式', '预防规范'],
      },
      {
        title: '边缘渲染 Edge Runtime 的能力边界',
        summary: 'Node API 限制、数据库连接与冷启动权衡。',
        tags: 'Edge,SSR,部署',
        sections: ['Runtime 对比', 'API 限制', '数据库访问', '冷启动'],
      },
    ],
  },
  {
    yearMonth: '2025-09',
    theme: '前端安全',
    posts: [
      {
        title: 'XSS 防护：DOMPurify、CSP 与 Markdown 渲染',
        summary: '博客/评论场景下的 sanitization 策略。',
        tags: '安全,XSS,CSP',
        sections: ['XSS 类型', 'sanitization', 'CSP 配置', 'Markdown 安全'],
      },
      {
        title: 'CSRF 与 JWT 存储：HttpOnly Cookie vs localStorage',
        summary: '前后端分离下的 Token 方案与安全 trade-off。',
        tags: '安全,JWT,鉴权',
        sections: ['CSRF 原理', 'Token 存储', 'Refresh 策略', 'SameSite'],
      },
      {
        title: 'API 限流与防刷在前端的配合',
        summary: '验证码、设备指纹与 NestJS Throttler 集成。',
        tags: '安全,限流,NestJS',
        sections: ['限流策略', '验证码', '设备指纹', '前端配合'],
      },
      {
        title: '依赖供应链安全：npm audit 与 lockfile 治理',
        summary: 'CI 门禁、Dependabot 与私有镜像策略。',
        tags: '安全,供应链,npm',
        sections: ['audit 流程', 'CI 门禁', 'Dependabot', '应急响应'],
      },
    ],
  },
  {
    yearMonth: '2025-10',
    theme: 'API 设计',
    posts: [
      {
        title: 'RESTful API 版本化与错误码规范',
        summary: 'URL vs Header 版本、统一错误体与 i18n 消息。',
        tags: 'REST,API,规范',
        sections: ['版本策略', '错误码设计', '分页规范', '文档维护'],
      },
      {
        title: 'GraphQL 在 BFF 层的适用场景',
        summary: '与 REST 共存、N+1 问题与 DataLoader。',
        tags: 'GraphQL,BFF,API',
        sections: ['GraphQL 优势', 'N+1 治理', '与 REST 共存', '工具链'],
      },
      {
        title: 'OpenAPI 驱动的前后端协作流程',
        summary: '契约优先、mock server 与 breaking change 检测。',
        tags: 'OpenAPI,协作,API',
        sections: ['契约优先', 'Mock 服务', '代码生成', '变更检测'],
      },
      {
        title: 'WebSocket 与 SSE 实时推送选型',
        summary: '聊天、通知场景下的连接管理与降级。',
        tags: 'WebSocket,SSE,实时',
        sections: ['协议对比', '连接管理', '心跳重连', '降级策略'],
      },
    ],
  },
  {
    yearMonth: '2025-11',
    theme: '测试体系',
    posts: [
      {
        title: 'Vitest + Testing Library 组件测试金字塔',
        summary: '单元、集成、E2E 比例与 MSW mock API。',
        tags: 'Vitest,测试,React',
        sections: ['测试金字塔', 'MSW mock', '组件测试', '快照慎用'],
      },
      {
        title: 'Playwright E2E 在 CI 中的稳定运行',
        summary: '并行、trace、重试与视觉回归。',
        tags: 'Playwright,E2E,CI',
        sections: ['CI 配置', '并行策略', 'Trace 调试', '视觉回归'],
      },
      {
        title: 'NestJS 单元测试与 e2e 测试分层',
        summary: 'TestingModule、Supertest 与测试数据库隔离。',
        tags: 'NestJS,测试,e2e',
        sections: ['单元测试', 'TestingModule', 'Supertest', 'DB 隔离'],
      },
      {
        title: 'Storybook 驱动设计与视觉测试',
        summary: 'CSF3、interaction tests 与 Chromatic 集成。',
        tags: 'Storybook,测试,组件',
        sections: ['CSF3 规范', 'Interaction test', '视觉测试', 'CI 集成'],
      },
    ],
  },
  {
    yearMonth: '2025-12',
    theme: '部署与 DevOps',
    posts: [
      {
        title: 'Docker 多阶段构建前端与 NestJS 镜像',
        summary: '层缓存、非 root 用户与 healthcheck 配置。',
        tags: 'Docker,部署,DevOps',
        sections: ['多阶段构建', '层缓存', '安全配置', 'healthcheck'],
      },
      {
        title: 'Nginx 反向代理微前端静态资源',
        summary: '子应用路径、gzip/brotli 与缓存头策略。',
        tags: 'Nginx,部署,微前端',
        sections: ['反向代理', '路径规则', '压缩配置', '缓存策略'],
      },
      {
        title: 'GitHub Actions 全栈项目 CI/CD 流水线',
        summary: 'lint、test、build、deploy 与环境密钥管理。',
        tags: 'CI/CD,GitHub Actions,DevOps',
        sections: ['流水线设计', '缓存优化', '多环境部署', '密钥管理'],
      },
      {
        title: '零停机部署与数据库迁移协调',
        summary: '蓝绿/滚动发布与 Prisma migrate deploy 顺序。',
        tags: '部署,数据库,DevOps',
        sections: ['部署策略', '迁移顺序', '回滚方案', '监控告警'],
      },
    ],
  },
  {
    yearMonth: '2026-01',
    theme: 'AI 辅助开发',
    posts: [
      {
        title: 'AI 编程助手在前端架构设计中的用法',
        summary: 'Prompt 工程、代码审查与架构文档生成。',
        tags: 'AI,工程效率,架构',
        sections: ['适用场景', 'Prompt 技巧', '代码审查', '文档生成'],
      },
      {
        title: 'RAG 知识库接入个人博客的技术方案',
        summary: '向量存储、分块策略与 NestJS AI 模块集成。',
        tags: 'AI,RAG,NestJS',
        sections: ['RAG 架构', '分块策略', '向量检索', 'API 设计'],
      },
      {
        title: 'LLM 流式响应在前端的 SSE 消费模式',
        summary: 'ReadableStream、打字机效果与中断控制。',
        tags: 'AI,SSE,前端',
        sections: ['SSE 消费', '流式 UI', '中断控制', '错误处理'],
      },
      {
        title: 'AI 生成代码的质量门禁与人工 Review',
        summary: '测试覆盖、lint 与架构一致性检查清单。',
        tags: 'AI,质量,Code Review',
        sections: ['质量门禁', '测试要求', '架构审查', '团队规范'],
      },
    ],
  },
  {
    yearMonth: '2026-02',
    theme: '低代码与平台化',
    posts: [
      {
        title: '低代码平台的 Schema 驱动渲染架构',
        summary: 'JSON Schema、组件注册表与运行时解释器设计。',
        tags: '低代码,Schema,架构',
        sections: ['Schema 设计', '组件注册', '渲染引擎', '扩展机制'],
      },
      {
        title: '表单引擎：动态校验与联动规则',
        summary: 'x-reactions、异步数据源与性能优化。',
        tags: '低代码,表单,引擎',
        sections: ['动态表单', '联动规则', '异步数据源', '性能优化'],
      },
      {
        title: '可视化搭建器的撤销重做与版本快照',
        summary: 'Command 模式、Immutable 状态与时间旅行调试。',
        tags: '低代码,编辑器,架构',
        sections: ['Command 模式', '快照机制', '协作冲突', '持久化'],
      },
      {
        title: '低代码产物代码导出与二次开发',
        summary: '源码生成质量、可维护性与 escape hatch 设计。',
        tags: '低代码,代码生成,工程化',
        sections: ['代码导出', '可维护性', 'Escape Hatch', '版本升级'],
      },
    ],
  },
  {
    yearMonth: '2026-03',
    theme: '跨端开发',
    posts: [
      {
        title: 'uni-app 条件编译与多端 API 抽象',
        summary: 'platform 差异封装、适配层目录规范。',
        tags: 'uni-app,跨端,架构',
        sections: ['条件编译', 'API 抽象', '目录规范', '调试技巧'],
      },
      {
        title: '小程序与 H5 共享业务逻辑的 Monorepo 实践',
        summary: 'packages/core 抽离与构建目标差异处理。',
        tags: 'uni-app,Monorepo,跨端',
        sections: ['逻辑抽离', '构建差异', '类型共享', '测试策略'],
      },
      {
        title: 'uni-app x 与原生性能优化路径',
        summary: '渲染层优化、列表性能与包体积治理。',
        tags: 'uni-app,性能,小程序',
        sections: ['渲染优化', '列表性能', '包体积', '原生能力'],
      },
      {
        title: '跨端 UI 组件库 uview-plus 主题定制',
        summary: 'SCSS 变量、暗色模式与 Design Token 映射。',
        tags: 'uni-app,uview,UI',
        sections: ['主题变量', '暗色模式', '组件扩展', 'Design Token'],
      },
    ],
  },
  {
    yearMonth: '2026-04',
    theme: '缓存与数据',
    posts: [
      {
        title: 'Redis 在前端 BFF 层的缓存模式',
        summary: 'Cache-Aside、TTL 策略与热点 key 保护。',
        tags: 'Redis,缓存,BFF',
        sections: ['缓存模式', 'TTL 设计', '热点保护', '一致性'],
      },
      {
        title: 'HTTP 缓存头与 CDN 配置实战',
        summary: 'Cache-Control、ETag 与 stale-while-revalidate。',
        tags: '缓存,CDN,HTTP',
        sections: ['缓存头语义', 'CDN 规则', '版本化资源', '调试方法'],
      },
      {
        title: 'React Query 持久化与离线优先',
        summary: 'persistQueryClient、IndexedDB 与冲突合并。',
        tags: 'React Query,缓存,离线',
        sections: ['持久化配置', 'IndexedDB', '离线策略', '冲突处理'],
      },
      {
        title: 'Service Worker 静态资源缓存策略',
        summary: 'Workbox 路由、更新提示与 PWA 边界。',
        tags: 'Service Worker,PWA,缓存',
        sections: ['SW 生命周期', 'Workbox', '更新策略', 'PWA 适用性'],
      },
    ],
  },
  {
    yearMonth: '2026-05',
    theme: '可观测性',
    posts: [
      {
        title: '前端错误监控：Sentry 集成与 Source Map 上传',
        summary: 'release 版本、用户上下文与告警规则。',
        tags: '监控,Sentry,可观测性',
        sections: ['Sentry 集成', 'Source Map', '上下文', '告警规则'],
      },
      {
        title: 'Web Vitals 上报与自定义性能指标',
        summary: 'web-vitals 库、Beacon API 与后端聚合。',
        tags: '性能,监控,指标',
        sections: ['指标采集', '上报通道', '聚合分析', '大盘设计'],
      },
      {
        title: 'NestJS 结构化日志与请求追踪',
        summary: 'Pino、requestId 与 ELK/Loki 对接。',
        tags: 'NestJS,日志,可观测性',
        sections: ['结构化日志', 'requestId', '日志采集', '查询分析'],
      },
      {
        title: '分布式追踪 OpenTelemetry 入门',
        summary: 'Trace/Span、前后端链路串联与采样策略。',
        tags: 'OpenTelemetry,追踪,架构',
        sections: ['核心概念', '前端埋点', '链路串联', '采样策略'],
      },
    ],
  },
  {
    yearMonth: '2026-06',
    theme: '架构总结',
    posts: [
      {
        title: '个人全栈站点架构复盘：Next + qiankun + Nest',
        summary: '两年演进中的关键决策与技术债务清理记录。',
        tags: '架构,复盘,全栈',
        sections: ['架构演进', '关键决策', '技术债务', '下一步计划'],
      },
      {
        title: '2026 前端架构趋势：RSC、AI 与边缘计算',
        summary: '从社区动态与生产实践看未来一年的技术选型。',
        tags: '架构,趋势,前端',
        sections: ['RSC 成熟度', 'AI 集成', '边缘计算', '选型建议'],
      },
      {
        title: '从技术负责人视角看前端团队工程化成熟度',
        summary: '代码规范、测试、监控、文档四维评估模型。',
        sections: ['评估模型', '规范建设', '测试文化', '持续改进'],
        tags: '工程化,团队,管理',
      },
      {
        title: '写给初级工程师的全栈成长路线',
        summary: 'HTML/CSS/JS → 框架 → 后端 → 架构的系统学习路径。',
        tags: '成长,全栈,前端',
        sections: ['基础阶段', '框架深入', '后端入门', '架构思维'],
      },
    ],
  },
];

/**
 * 生成全部博客种子（24 个月 × 每月 8~14 篇随机）
 */
export function generateArticleSeeds(): ArticleSeedItem[] {
  const items: ArticleSeedItem[] = [];

  for (const month of MONTH_THEMES) {
    const count = getMonthPostCount(month.yearMonth);
    const posts = expandPostsForMonth(month.theme, month.posts, count, month.yearMonth);
    const dates = buildPublishedDates(month.yearMonth, posts.length);

    posts.forEach((post, index) => {
      items.push({
        title: post.title,
        summary: post.summary,
        content: buildDetailedMarkdownContent(
          post.title,
          month.theme,
          post.sections,
          post.tags,
        ),
        category: resolveCategory(post.tags),
        tags: post.tags,
        slug: buildSlug(month.yearMonth, index),
        publishedAt: dates[index],
      });
    });
  }

  return items;
}
