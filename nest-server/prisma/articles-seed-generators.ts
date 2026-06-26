/**
 * 博客种子：随机篇数、扩展话题与发布日期生成
 */

/** 基于字符串的确定性伪随机 [0, 1) */
export function seededRandom(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

/** 确定性整数 [min, max] */
export function seededInt(seed: string, min: number, max: number): number {
  return min + Math.floor(seededRandom(seed) * (max - min + 1));
}

/** 每月文章篇数：随机，最低 8 篇，最高 14 篇 */
export function getMonthPostCount(yearMonth: string): number {
  return seededInt(`count:${yearMonth}`, 8, 14);
}

/** 当月内均匀分散的发布日期（最多 31 天） */
export function buildPublishedDates(yearMonth: string, count: number): Date[] {
  const [year, month] = yearMonth.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const dates: Date[] = [];

  for (let i = 0; i < count; i++) {
    // 确定性「随机」日 + 时分，避免全部堆在同一天
    const day = seededInt(`day:${yearMonth}:${i}`, 1, daysInMonth);
    const hour = seededInt(`hour:${yearMonth}:${i}`, 8, 21);
    const minute = seededInt(`min:${yearMonth}:${i}`, 0, 59);
    dates.push(new Date(Date.UTC(year, month - 1, day, hour - 8, minute, 0)));
  }

  dates.sort((a, b) => a.getTime() - b.getTime());
  return dates;
}

/** 扩展话题后缀 — 用于补足每月 8+ 篇 */
export const EXTRA_TOPIC_SUFFIXES: Array<{
  suffix: string;
  summaryTpl: string;
  sections: string[];
}> = [
  {
    suffix: '深入原理与源码走读',
    summaryTpl: '从设计动机到核心实现，逐层拆解 {theme} 的关键机制，附调试技巧。',
    sections: ['设计动机', '核心数据结构', '关键流程时序', '调试与断点', '延伸阅读'],
  },
  {
    suffix: '生产环境部署完整指南',
    summaryTpl: '覆盖 {theme} 在 Docker/K8s/Nginx 下的部署、健康检查与灰度发布流程。',
    sections: ['环境规划', '构建产物', '容器化配置', '灰度与回滚', '上线验收'],
  },
  {
    suffix: '性能优化实战手册',
    summaryTpl: '基于真实监控数据，总结 {theme} 场景下的瓶颈定位与优化手段。',
    sections: ['指标基线', '瓶颈定位', '优化手段', '前后对比', '持续监控'],
  },
  {
    suffix: '线上故障排查案例集',
    summaryTpl: '整理 {theme} 相关典型故障的现象、根因、修复与预防清单。',
    sections: ['故障现象', '排查路径', '根因分析', '修复方案', '预防清单'],
  },
  {
    suffix: '团队落地与规范制定',
    summaryTpl: '如何在团队内推广 {theme}：规范文档、Review 清单与培训路径。',
    sections: ['现状评估', '规范草案', 'Review 清单', '培训计划', '效果度量'],
  },
  {
    suffix: '与旧系统迁移方案',
    summaryTpl: '从遗留架构迁移到 {theme} 的分阶段策略、兼容层与风险控制。',
    sections: ['现状调研', '目标架构', '分阶段迁移', '兼容层设计', '风险与回滚'],
  },
  {
    suffix: '安全加固与合规要点',
    summaryTpl: '针对 {theme} 的鉴权、审计、敏感数据与依赖漏洞治理。',
    sections: ['威胁模型', '鉴权加固', '数据保护', '依赖治理', '审计日志'],
  },
  {
    suffix: 'Interview 高频考点梳理',
    summaryTpl: '梳理 {theme} 相关面试题与参考答案，适合进阶复习。',
    sections: ['基础概念', '手写题', '场景设计题', '追问链', '复习计划'],
  },
  {
    suffix: '工具链与自动化集成',
    summaryTpl: 'ESLint、CI、Changesets 等工具如何与 {theme} 项目深度集成。',
    sections: ['工具选型', 'CI 流水线', '质量门禁', '自动化发布', '维护成本'],
  },
  {
    suffix: '从零搭建 Demo 全记录',
    summaryTpl: '手把手用最小代码搭建 {theme} 可运行 demo，含目录结构与命令。',
    sections: ['需求范围', '项目初始化', '核心代码', '本地验证', '扩展方向'],
  },
];

/** 文章模板 */
export interface PostTemplate {
  title: string;
  summary: string;
  tags: string;
  sections: string[];
}

/** 将基础 4 篇扩展为至少 8 篇，再随机追加至目标数量 */
export function expandPostsForMonth(
  theme: string,
  basePosts: PostTemplate[],
  targetCount: number,
  yearMonth: string,
): PostTemplate[] {
  const result: PostTemplate[] = [...basePosts];
  const baseTags = basePosts[0]?.tags ?? '前端架构,工程化';

  let extraIndex = 0;
  while (result.length < targetCount) {
    const tpl = EXTRA_TOPIC_SUFFIXES[extraIndex % EXTRA_TOPIC_SUFFIXES.length];
    const variant = Math.floor(extraIndex / EXTRA_TOPIC_SUFFIXES.length) + 1;
    const titleSuffix = variant > 1 ? `${tpl.suffix}（${variant}）` : tpl.suffix;

    result.push({
      title: `${theme} · ${titleSuffix}`,
      summary: tpl.summaryTpl.replace(/\{theme\}/g, theme),
      tags: baseTags,
      sections: [...tpl.sections],
    });
    extraIndex += 1;
  }

  // 若目标少于已有（不应发生），截断
  return result.slice(0, targetCount);
}

/** slug：arch-202407-01，支持两位序号（最多 99 篇/月） */
export function buildSlug(yearMonth: string, index: number): string {
  const ym = yearMonth.replace('-', '');
  return `arch-${ym}-${String(index + 1).padStart(2, '0')}`;
}

/** 根据 tags 推断分类 */
export function resolveCategory(tags: string): string {
  if (tags.includes('NestJS') || tags.includes('Prisma') || tags.includes('Redis')) {
    return '后端';
  }
  if (
    tags.includes('Docker') ||
    tags.includes('CI') ||
    tags.includes('DevOps') ||
    tags.includes('部署') ||
    tags.includes('Nginx')
  ) {
    return 'DevOps';
  }
  if (tags.includes('安全')) {
    return '安全';
  }
  if (tags.includes('测试') || tags.includes('Vitest') || tags.includes('Playwright')) {
    return '测试';
  }
  return '前端架构';
}
