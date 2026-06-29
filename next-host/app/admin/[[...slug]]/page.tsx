/**
 * 管理后台统一占位页（/admin 与 /admin/* 共用）。
 *
 * 必须使用可选 catch-all，避免子应用 React Router 将 URL 从 /admin 切到
 * /admin/dashboard 时，Next.js 在 page.tsx 与 [...slug]/page.tsx 之间切换，
 * 触发基座 re-render 并清掉 Qiankun 注入的 DOM。
 */
export default function AdminMicroAppPage() {
  return null;
}
