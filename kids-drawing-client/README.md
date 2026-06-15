# 小画家启蒙 — 儿童绘画 uni-app-x 应用

面向 3–8 岁儿童的绘画启蒙应用，支持循序渐进课程、Canvas 绘画工作台、本地进度与作品集。

## 技术栈

- **uni-app-x**（`.uvue` + UTS）
- 状态管理：`store/*.uts` + `reactive`（不使用 Pinia）
- 绘画：Canvas + CanvasRenderingContext2D
- 数据：本地 `uni.setStorage`，`api/` 层预留 nest-server 对接

## 运行方式（需 HBuilderX）

> uni-app-x 项目**无法通过 CLI 创建/编译**，请使用 [HBuilderX](https://www.dcloud.io/hbuilderx.html)（建议 4.25+）打开本目录。  
> **不要**直接用浏览器打开 `index.html`，也不要用静态服务器访问——需由 HBuilderX 编译后通过 `/main` 入口加载。

1. HBuilderX → 文件 → 打开目录 → 选择 `kids-drawing-client/`
2. 确认 `manifest.json` 含 `"uni-app-x": {}` 节点；若未识别为 uni-app-x，右键项目 → 重新识别项目类型
3. 运行到目标平台：
   - **Web 浏览器**：运行 → 运行到浏览器 → Chrome（推荐开发调试）
   - **Android**：运行 → 运行到手机或模拟器 → Android App 基座
   - **iOS**：运行 → 运行到手机或模拟器 → iOS 基座
   - **鸿蒙**：运行 → 运行到手机或模拟器 → HarmonyOS

## 页面结构

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `pages/home/index` | 继续学习、快捷入口 |
| 课程地图 | `pages/course/map` | 5 章关卡进度 |
| 课时详情 | `pages/lesson/detail` | 步骤预览 |
| 绘画工作台 | `pages/studio/index` | Canvas 绘线核心 |
| 作品集 | `pages/gallery/index` | 本地保存作品 |
| 成长档案 | `pages/profile/index` | 星星、徽章、连续天数 |

## 与 convenience-client 的差异

| 维度 | convenience-client | kids-drawing-client |
|------|-------------------|---------------------|
| 引擎 | uni-app Vue3 | uni-app-x |
| 文件 | `.vue` + `.ts` | `.uvue` + `.uts` |
| UI 库 | uview-plus | 内置组件自建 |
| 状态 | Pinia | `.uts` reactive |
| 构建 | Vite CLI | HBuilderX |

## API 预留

首期 `api/client.uts` 中 `API_ENABLED = false`，数据仅存本地。后续对接 nest-server 时：

1. 将 `API_ENABLED` 设为 `true`
2. 配置 `API_BASE_URL`
3. 在 nest-server 实现 `/api/kids-drawing/*` 路由

## 课程数据

- 配置源：`data/lessons.json`
- 运行时加载：`utils/lesson-loader.uts`（内嵌 JSON，避免原生端 import 限制）
