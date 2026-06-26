/**
 * 博客 Markdown 正文生成器
 * 按确定性随机组合多种开篇、小节与收尾模板，避免千篇一律的长文结构
 */

import { seededInt, seededRandom } from './articles-seed-generators';

/** 从标题提取可用于 TypeScript 标识符的片段 */
function toTypeName(text: string): string {
  const ascii = text.replace(/[^a-zA-Z0-9]/g, '');
  if (ascii.length >= 3) return ascii.slice(0, 20);
  return 'AppModule';
}

/** 根据主题与标签挑选示例代码语言块 */
function buildCodeSample(title: string, section: string, theme: string, tags: string): string {
  const typeName = toTypeName(section);

  if (tags.includes('NestJS') || tags.includes('Prisma')) {
    return `\`\`\`typescript
// ${section} — NestJS 示例
import { Injectable, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/** ${title} 中「${section}」的服务层封装 */
@Injectable()
export class ${typeName}Service {
  constructor(private readonly prisma: PrismaService) {}

  /** 分页查询，含软删除过滤 */
  async queryList(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.prisma.article.findMany({
        skip,
        take: pageSize,
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.article.count(),
    ]);
    return { items, total, page, pageSize };
  }
}

@Module({
  providers: [${typeName}Service, PrismaService],
  exports: [${typeName}Service],
})
export class ${typeName}Module {}
\`\`\``;
  }

  if (tags.includes('Vue') || tags.includes('uni-app')) {
    return `\`\`\`vue
<!-- ${section} — Vue 3 Composition API -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

/** ${section} 相关状态 */
const loading = ref(false);
const list = ref<Array<{ id: number; title: string }>>([]);

const displayCount = computed(() => list.value.length);

async function queryData() {
  loading.value = true;
  try {
    const res = await fetch('/api/articles');
    list.value = await res.json();
  } finally {
    loading.value = false;
  }
}

onMounted(queryData);
</script>

<template>
  <section class="${typeName.toLowerCase()}-panel">
    <h2>${section}</h2>
    <p v-if="loading">加载中…</p>
    <ul v-else>
      <li v-for="item in list" :key="item.id">{{ item.title }}</li>
    </ul>
    <footer>共 {{ displayCount }} 条 — ${theme}</footer>
  </section>
</template>
\`\`\``;
  }

  if (tags.includes('Next.js') || tags.includes('React') || tags.includes('RSC')) {
    return `\`\`\`tsx
// ${section} — React / Next.js 示例
'use client';

import { useCallback, useEffect, useState } from 'react';

interface ${typeName}Props {
  /** 初始页码 */
  initialPage?: number;
}

/** ${title} — ${section} 客户端交互层 */
export function ${typeName}Panel({ initialPage = 1 }: ${typeName}Props) {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<{ title: string }[]>([]);
  const [pending, setPending] = useState(false);

  const load = useCallback(async () => {
    setPending(true);
    try {
      const res = await fetch(\`/api/articles?page=\${page}\`);
      const json = await res.json();
      setData(json.items ?? []);
    } finally {
      setPending(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section aria-busy={pending} data-theme="${theme}">
      <h2>${section}</h2>
      <ul>
        {data.map((row, i) => (
          <li key={i}>{row.title}</li>
        ))}
      </ul>
      <button type="button" onClick={() => setPage((p) => p + 1)}>
        下一页
      </button>
    </section>
  );
}
\`\`\``;
  }

  return `\`\`\`typescript
/**
 * ${section} — 通用 TypeScript 配置/类型示例
 * 所属主题：${theme}
 */
export interface ${typeName}Options {
  /** 功能开关 */
  enabled: boolean;
  /** 运行环境 */
  env: 'development' | 'staging' | 'production';
  /** 超时毫秒 */
  timeoutMs: number;
}

export class ${typeName}Manager {
  constructor(private readonly options: ${typeName}Options) {}

  /** 初始化 ${section} 模块 */
  async bootstrap(): Promise<void> {
    if (!this.options.enabled) return;
    console.info(\`[${typeName}] bootstrapping in \${this.options.env}\`);
    await this.loadConfig();
  }

  private async loadConfig(): Promise<void> {
    await new Promise((r) => setTimeout(r, this.options.timeoutMs / 10));
  }
}
\`\`\``;
}

/** 架构示意 ASCII 图（部分文章随机省略） */
function buildArchitectureDiagram(theme: string): string {
  return `\`\`\`text
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  展示层      │ ──▶ │  BFF / API   │ ──▶ │  数据 & 缓存 │
│  React/Vue  │     │  Nest/Next   │     │  Prisma/Redis│
└─────────────┘     └──────────────┘     └─────────────┘
       │                    │                    │
       └────────────────────┴────────────────────┘
              可观测性 / 鉴权 / ${theme}
\`\`\``;
}

type SectionBuilder = (
  index: number,
  section: string,
  title: string,
  theme: string,
  tags: string,
) => string;

/** 叙事型：短段落 + 要点列表 + 代码 */
const buildNarrativeSection: SectionBuilder = (index, section, title, theme, tags) => {
  const code = buildCodeSample(title, section, theme, tags);
  return `## ${index}. ${section}

在 **${theme}** 项目里，${section} 往往是「第一次能跑」和「长期能维护」的分水岭。下面用尽量少的概念，把关键路径讲清楚。

**为什么值得单独成节？**

- 它直接影响 ${theme} 模块的迭代速度
- 排障时，80% 的时间花在理解这一层的边界
- 与 ${title} 相关的线上问题，多数可以追溯到这里的约定缺失

${code}

> **小结**：先把 ${section} 的输入输出写进 README，再谈抽象；团队两人以上时，这一步能省掉大量口头同步。

`;
};

/** 操作手册型：分步清单 + 代码 + 注意事项 */
const buildHowToSection: SectionBuilder = (index, section, title, theme, tags) => {
  const code = buildCodeSample(title, section, theme, tags);
  return `## ${index}. ${section}

### 操作步骤

| 步骤 | 动作 | 验收 |
|------|------|------|
| 1 | 画出 ${section} 上下游依赖 | 时序图或组件图可复用 |
| 2 | 实现 happy path | 本地可演示 |
| 3 | 补日志与错误码 | 故障可定位到模块 |
| 4 | 写 2 条回归用例 | CI 绿灯 |

${code}

**注意**：在 ${theme} 场景下，避免在 UI 层写死业务规则；${section} 的变更应能在 service 层单测覆盖。

`;
};

/** 对比型：表格先行 + 简短结论 */
const buildComparisonSection: SectionBuilder = (index, section, title, theme, tags) => {
  const code = buildCodeSample(title, section, theme, tags);
  return `## ${index}. ${section}

| 方案 | 适用 | 代价 |
|------|------|------|
| 渐进增强 | 存量系统、人力紧张 | 短期存在双轨代码 |
| 一次性重构 | 模块边界已清晰 | 需要冻结需求窗口 |
| 封装兼容层 | 外部依赖不稳定 | 多一层 indirection |

针对 **${title}** 中的 ${section}，我们更倾向「渐进增强 + 显式废弃时间表」，而不是大爆炸式重写。

${code}

`;
};

/** 深挖型：概念 + 流程 + 误区 */
const buildDeepDiveSection: SectionBuilder = (index, section, title, theme, tags) => {
  const code = buildCodeSample(title, section, theme, tags);
  return `## ${index}. ${section}

### 核心概念

${section} 在 ${theme} 体系里承担「契约层」角色：上游只关心返回值形状，下游只关心输入约束。${title} 讨论的就是如何在不过度设计的前提下，把这条边界画稳。

### 典型流程

1. 定义 DTO / 类型
2. 在 service 实现业务规则
3. UI 或 API 层做薄封装
4. 用集成测试锁住行为

${code}

### 常见误区

- 把 ${section} 当成「万能工具箱」，塞入无关逻辑
- 缺少失败分支文档，排障靠读代码
- 与 ${theme} 其他模块共享可变单例

`;
};

/** 案例型：场景驱动 */
const buildCaseStudySection: SectionBuilder = (index, section, title, theme, tags) => {
  const code = buildCodeSample(title, section, theme, tags);
  return `## ${index}. ${section}

**场景**：某次 ${theme} 迭代需要在两周内上线 ${section}，但旧接口不能 breaking change。

**问题**：改动面跨三个包，Review 难以评估回归范围。

**做法**：先加兼容层，新逻辑走 feature flag；观测稳定后再删旧路径。

${code}

**结果**：发布窗口内零回滚；${section} 相关告警在上线 48 小时内收敛。

`;
};

/** 清单型：自检列表 + 可选代码 */
const buildChecklistSection: SectionBuilder = (index, section, title, theme, tags) => {
  const withCode = seededRandom(`${title}:${section}:code`) > 0.35;
  const code = withCode ? `\n${buildCodeSample(title, section, theme, tags)}\n` : '';
  return `## ${index}. ${section}

上线 ${section} 前，我们在 ${theme} 项目里会用下面这张清单快速过一遍（约 15 分钟）：

- [ ] 接口契约与错误码已同步到文档
- [ ] 关键路径有自动化测试
- [ ] 配置项走环境变量，无密钥入库
- [ ] 监控面板能看到 ${section} 相关指标
- [ ] 回滚步骤写在 Runbook 里

${code}
`;
};

const SECTION_BUILDERS: SectionBuilder[] = [
  buildNarrativeSection,
  buildHowToSection,
  buildComparisonSection,
  buildDeepDiveSection,
  buildCaseStudySection,
  buildChecklistSection,
];

/** 按标题与小节名确定性挑选小节模板 */
function buildSectionBlock(
  index: number,
  section: string,
  title: string,
  theme: string,
  tags: string,
): string {
  const builderIndex = seededInt(`section:${title}:${section}:${index}`, 0, SECTION_BUILDERS.length - 1);
  return SECTION_BUILDERS[builderIndex](index, section, title, theme, tags);
}

/** 开篇模板 A：元信息 + 前言 */
function buildIntroVariantA(
  title: string,
  theme: string,
  sections: string[],
  tags: string,
): string {
  return `# ${title}

> **系列**：${theme} · 全栈偏前端架构  
> **标签**：${tags}  
> **阅读建议**：约 15 分钟，可按目录跳读。

---

## 前言

${title} 源于 **${theme}** 方向上的真实迭代。全文围绕 ${sections.length} 个主题展开，每一节的结构并不相同 —— 有的偏操作步骤，有的是对比表或案例复盘。

### 你将学到

- ${sections[0] ?? '核心概念'} 的落地路径  
- ${sections[1] ?? '工程约定'} 在团队中的推行方式  
- 可直接复用的代码片段与自检清单  

---

`;
}

/** 开篇模板 B：TL;DR 置顶 */
function buildIntroVariantB(
  title: string,
  theme: string,
  sections: string[],
  tags: string,
): string {
  return `# ${title}

**TL;DR** — 如果你只有 3 分钟：先读「${sections[0] ?? '第一节'}」和文末总结；其余章节按需展开。

标签：${tags} · 主题：${theme}

---

## 背景

我们在做 **${theme}** 时写过一版「能跑就行」的实现，后来在 ${sections.join('、')} 等环节陆续补课。这篇文章把踩过的坑和最终采用的折中方案整理出来，避免你从零摸索。

`;
}

/** 开篇模板 C：问答式引入 */
function buildIntroVariantC(
  title: string,
  theme: string,
  sections: string[],
  tags: string,
): string {
  return `# ${title}

## 这篇文章解决什么问题？

> 当你已经在用 ${theme}，却在 **${sections[0] ?? '核心模块'}** 上反复返工时，本文提供一套可复制的讨论框架。

${title} 不会重复官方文档的定义，而是聚焦：**选哪种做法、为什么、如何验证**。涉及标签：${tags}。

后续章节包括：${sections.map((s) => `\`${s}\``).join('、')}。

---

`;
}

/** 开篇模板 D：短引子 + 直接进正文 */
function buildIntroVariantD(title: string, theme: string, tags: string): string {
  return `# ${title}

_${theme} · ${tags}_

下面不铺垫太多概念，直接从实践中提炼的内容开始。建议打开目录预览，跳到你关心的章节。

---

`;
}

/** 按索引选取开篇模板，避免混合参数签名带来的类型问题 */
function buildIntro(title: string, theme: string, sections: string[], tags: string): string {
  const introIndex = seededInt(`intro:${title}`, 0, 3);
  switch (introIndex) {
    case 0:
      return buildIntroVariantA(title, theme, sections, tags);
    case 1:
      return buildIntroVariantB(title, theme, sections, tags);
    case 2:
      return buildIntroVariantC(title, theme, sections, tags);
    default:
      return buildIntroVariantD(title, theme, tags);
  }
}

/** 收尾：FAQ */
function buildOutroFaq(title: string, theme: string, sections: string[]): string {
  return `## 常见问题

**${theme} 项目最容易在哪一步翻车？**  
边界不清：UI 写业务、service 操作 DOM、或多个模块共享可变全局。PR 里加一句「是否引入跨层依赖」往往就够了。

**如何向非技术同事解释 ${title}？**  
用「故障恢复时间」和「新需求交付周期」两个指标，比堆术语更有效。

**小团队也要这么分层吗？**  
要分层，不必过度抽象。\`api / service / ui\` 三层目录即可，第三次重复再抽公共包。

---

## 总结

${title} 的核心，是在 **${theme}** 约束下找到够简单、又够健壮的解法。重点章节：${sections.slice(0, 3).join('、')}。

---

*本文属于个人全栈站点博客种子内容。*
`;
}

/** 收尾：延伸阅读 */
function buildOutroResources(title: string, theme: string, sections: string[]): string {
  return `## 延伸阅读

- 官方文档中与 **${theme}** 相关的 Best Practices
- 团队内部关于 \`${sections[0] ?? '架构'}\` 的 ADR（Architecture Decision Record）
- 开源项目中类似 ${title} 的 issue 讨论串

## 复盘模板

| 项目 | 记录 |
|------|------|
| 本次改动范围 | ${sections.join(' / ')} |
| 上线窗口 | 建议低峰 + 可回滚 |
| 观测指标 | 错误率、P99、业务转化 |
| 遗留项 | 写入 backlog，标注 owner |

---

*${title} · ${theme}*
`;
}

/** 按索引选取收尾模板（FAQ / 延伸阅读 / 快速参考） */
function buildOutro(title: string, theme: string, sections: string[]): string {
  const outroIndex = seededInt(`outro:${title}`, 0, 2);
  switch (outroIndex) {
    case 0:
      return buildOutroFaq(title, theme, sections);
    case 1:
      return buildOutroResources(title, theme, sections);
    default:
      return buildOutroQuickRef(title, theme, sections);
  }
}

/**
 * 从 Markdown 正文中移除「## 上线前 Checklist」整段（含任务列表，保留下一章节）。
 * 用于清理历史种子数据。
 */
export function stripLaunchChecklistSection(content: string): string {
  return content
    .replace(/(?:\r?\n)?## 上线前 Checklist\r?\n(?:[\s\S]*?)(?=\r?\n## |\r?\n---|\s*$)/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd();
}

/** 收尾：快速参考卡 */
function buildOutroQuickRef(title: string, theme: string, sections: string[]): string {
  return `## 快速参考

| 主题 | 关键词 |
|------|--------|
| 本文 | ${title} |
| 方向 | ${theme} |
| 章节 | ${sections.join(' · ')} |

> 收藏后可在排障时对照目录跳读，比通篇重读更高效。

---

*Generated seed article*
`;
}

/**
 * 生成完整详细 Markdown 正文
 * 开篇 / 小节 / 收尾均从多套模板中确定性随机选取，降低「同一套骨架」的观感
 */
export function buildDetailedMarkdownContent(
  title: string,
  theme: string,
  sections: string[],
  tags: string,
): string {
  const intro = buildIntro(title, theme, sections, tags);

  const showDiagram = seededRandom(`diagram:${title}`) > 0.45;
  const architectureBlock = showDiagram
    ? `## 架构一瞥

${buildArchitectureDiagram(theme)}

在 ${theme} 场景下，建议 **薄 UI、厚领域、显式边界**：UI 负责交互，规则沉到 service，跨模块用 DTO 通信。

---

`
    : '';

  const body = sections
    .map((sec, i) => buildSectionBlock(i + 1, sec, title, theme, tags))
    .join('\n');

  const outro = buildOutro(title, theme, sections);

  return intro + architectureBlock + body + outro;
}
