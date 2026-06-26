/**
 * 博客 Markdown 正文生成器
 * 输出结构化长文：背景、分节详解、代码示例、对比表、踩坑与总结
 */

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
    // 从远程或本地加载配置，支持热更新
    await new Promise((r) => setTimeout(r, this.options.timeoutMs / 10));
  }
}
\`\`\``;
  }

/**
 * 生成单个小节的详细 Markdown
 */
function buildSectionBlock(
  index: number,
  section: string,
  title: string,
  theme: string,
  tags: string,
): string {
  const code = buildCodeSample(title, section, theme, tags);
  return `## ${index}. ${section}

### 背景与目标

在 **${theme}** 方向的工程实践中，「${section}」通常是团队从 POC 走向生产的关键节点。很多项目在早期为了赶进度会跳过这一环，结果在流量上涨或人员变动时付出更高昂的维护成本。本文在这一节给出可落地的步骤、验收标准，以及我们团队在类似场景下的真实取舍。

从架构视角看，${section} 需要同时满足三类约束：**开发效率**（新人能否在一周内上手）、**运行稳定性**（异常能否快速定位）、**演进空间**（六个月后是否还能无痛扩展）。下面按「概念 → 实现 → 验证」的顺序展开。

### 实现步骤

1. **梳理边界**：明确 ${section} 的输入/输出、失败模式与上下游依赖，画一张简单的时序图或组件图。
2. **最小实现**：先完成 happy path，避免一开始就引入过多抽象；保留扩展点（interface / hook）。
3. **补齐横切能力**：日志、指标、鉴权、限流等按优先级分批加入。
4. **编写回归用例**：至少覆盖核心路径与两个典型异常分支。
5. **文档与 Runbook**：记录配置项、常见告警与回滚步骤。

${code}

### 设计考量

| 维度 | 推荐做法 | 需避免的坑 |
|------|----------|------------|
| 可测试性 | 依赖注入、纯函数拆分 | 在组件内直接 fetch 且无 mock 点 |
| 可观测性 | 结构化日志 + traceId | 仅 console.log 且无 request 关联 |
| 性能 | 按需加载、缓存热点数据 | 首屏拉取全量列表 |
| 安全 | 最小权限、输入校验 | 信任前端传来的 ID 不做服务端校验 |

### 实践建议

- 与产品/后端对齐 **${section}** 的 SLA：例如 P99 延迟、可用性目标。
- Code Review 时重点看：错误处理是否完整、类型是否收窄、是否有 hidden coupling。
- 每季度做一次小重构，清理 dead code 与过期配置，防止 ${theme} 相关模块变成「黑盒」。

`;
}

/**
 * 生成完整详细 Markdown 正文
 */
export function buildDetailedMarkdownContent(
  title: string,
  theme: string,
  sections: string[],
  tags: string,
): string {
  const intro = `# ${title}

> **系列**：${theme} · 全栈偏前端架构  
> **标签**：${tags}  
> **阅读建议**：本文约 15–20 分钟，适合有 1–3 年前端经验、正在负责模块设计或技术选型的工程师。

---

## 前言

${title} 这篇文章源于我们在 **${theme}** 方向上的多次迭代。第一次做 demo 往往很快，但要达到「可长期维护的生产质量」，需要在架构分层、错误模型、监控与团队协作规范上投入相当精力。

全文围绕 ${sections.length} 个核心小节展开，每一节都包含：**为什么要做**、**怎么做（含代码）**、**如何验证**、**常见误区**。你可以按顺序通读，也可以把某一节当作 Runbook 在排障时查阅。

### 你将学到

- ${sections[0] ?? '核心概念'} 的完整落地路径  
- 与 ${theme} 相关的工程化与团队协作约定  
- 可直接复制到项目中的 TypeScript / 框架代码片段  
- 上线前自检清单与复盘模板  

---

## 架构总览

\`\`\`text
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  展示层      │ ──▶ │  BFF / API   │ ──▶ │  数据 & 缓存 │
│  React/Vue  │     │  Nest/Next   │     │  Prisma/Redis│
└─────────────┘     └──────────────┘     └─────────────┘
       │                    │                    │
       └────────────────────┴────────────────────┘
                    可观测性 / 鉴权 / 配置中心
\`\`\`

在 ${theme} 场景下，建议坚持 **「薄 UI、厚领域、显式边界」**：UI 只负责展示与交互；业务规则沉到 service/domain；跨模块通信用明确契约（DTO / Event），避免隐式全局状态。

---

`;

  const body = sections
    .map((sec, i) => buildSectionBlock(i + 1, sec, title, theme, tags))
    .join('\n');

  const pitfalls = `## 常见问题 FAQ

### Q1：${theme} 项目最容易在哪一步翻车？

通常是 **边界不清**：UI 层写业务规则、service 层直接操作 DOM、或多个模块共享可变全局对象。建议在 PR 模板里加一项：「本 PR 是否引入新的跨层依赖？」

### Q2：如何向非技术同事解释 ${title} 的价值？

用「减少线上故障恢复时间」和「缩短新需求交付周期」两个指标，比堆技术名词更有效。可以准备一个 before/after 对比：重构前改一个字段要动 5 个文件，重构后 1 个。

### Q3：团队规模很小，还需要这么「重」的架构吗？

需要分层，但不需要过度抽象。两人团队也可以有 \`api / service / ui\` 三层目录，等第三次出现重复逻辑时再抽公共包。

---

## 上线前 Checklist

- [ ] 核心路径单元测试 / 集成测试通过  
- [ ]  staging 环境压测或手工走查完成  
- [ ] 监控告警（错误率、延迟）已配置  
- [ ] 回滚方案与数据库迁移顺序已文档化  
- [ ] 相关配置项已纳入环境变量管理，无密钥硬编码  

---

## 总结

${title} 的本质，是在 **${theme}** 约束下找到「足够简单、又足够健壮」的解法。不要追求一步到位的大重构；以 **可观测的小步迭代** 为主，每两周回顾一次指标与代码健康度。

如果这篇文章对你有帮助，欢迎收藏并在实践中反馈 —— 尤其是 ${sections.join('、')} 等章节，我们会根据读者问题持续补充案例。

---

*本文属于个人全栈站点博客种子内容，主题：全栈偏前端架构。*
`;

  return intro + body + pitfalls;
}
