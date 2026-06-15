# 小画家启蒙 — 儿童绘画 uni-app 应用

面向 3–8 岁儿童的绘画启蒙应用，支持循序渐进课程、Canvas 绘画工作台、本地进度与作品集。

## 技术栈

- **uni-app Vue3** + **TypeScript** + Vite CLI
- 状态管理：**Pinia**
- 绘画：Canvas 2d + CanvasRenderingContext2D
- 数据：本地 `uni.setStorage`，`api/` 层预留 nest-server 对接

## 运行方式

### 安装依赖

```bash
cd kids-drawing-client
pnpm install
```

或在根目录：

```bash
pnpm run install:kids-drawing
```

### 开发

```bash
# 仅 H5（端口 5176）
pnpm run dev:kids-drawing:h5

# 微信小程序
pnpm run dev:kids-drawing:mp
```

根目录一键启动（输出指引）：

```bash
pnpm run dev:kids-drawing
```

浏览器访问：**http://localhost:5176**

### 构建

```bash
pnpm run build:kids-drawing:h5
pnpm run build:kids-drawing:mp
```

## 页面结构

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `pages/home/index` | 继续学习、快捷入口 |
| 课程地图 | `pages/course/map` | 5 章关卡进度 |
| 课时详情 | `pages/lesson/detail` | 步骤预览 |
| 绘画工作台 | `pages/studio/index` | Canvas 绘线核心 |
| 作品集 | `pages/gallery/index` | 本地保存作品 |
| 成长档案 | `pages/profile/index` | 星星、徽章、连续天数 |

## 与 convenience-client 的对比

| 维度 | convenience-client | kids-drawing-client |
|------|-------------------|---------------------|
| 引擎 | uni-app Vue3 | uni-app Vue3 |
| 文件 | `.vue` + `.ts` | `.vue` + `.ts` |
| UI | uview-plus | 内置组件自建（儿童友好） |
| 状态 | Pinia | Pinia |
| 构建 | Vite CLI | Vite CLI |

## API 预留

首期 `api/client.ts` 中 `API_ENABLED = false`，数据仅存本地。后续对接 nest-server 时：

1. 将 `API_ENABLED` 设为 `true`
2. 配置 `VITE_API_BASE_URL`
3. 在 nest-server 实现 `/api/kids-drawing/*` 路由

## 课程数据

- 配置源：`src/data/lessons.json`
- 运行时加载：`utils/lesson-loader.ts`
