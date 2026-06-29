/** app-web 页面路径与中文名称映射（与 nest-server analytics 统计范围一致） */
const APP_WEB_PAGE_LABELS: Record<string, string> = {
  '/about': '关于',
  '/projects': '项目作品',
  '/contact': '联系留言',
  '/links': '友情链接',
};

/** 将 app-web 路径转为可读页面名称，未知路径回退为原始 path */
export function formatAppWebPageLabel(path: string): string {
  const normalized = path.replace(/\/+$/, '') || '/';
  return APP_WEB_PAGE_LABELS[normalized] ?? normalized;
}
