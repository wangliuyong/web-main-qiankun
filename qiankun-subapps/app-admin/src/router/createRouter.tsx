import { Navigate, createBrowserRouter, type RouteObject } from 'react-router-dom';
import ForbiddenPage from '../pages/forbidden';
import type { AdminMenuNode } from '../types/rbac';
import LoginRoute from './guards/LoginRoute';
import PageTitleGuard from './guards/PageTitleGuard';
import RequireAuth from './guards/RequireAuth';
import AdminLayout from './layouts/AdminLayout';
import { flattenLeafMenus } from './menuUtils';
import { getPageByPath } from './pageRegistry';
import { getRouterBasename } from './routes';
import { buildHiddenAdminRoutes } from './hiddenRoutes';

const keepLoaderData: NonNullable<RouteObject['shouldRevalidate']> = () => false;

/** 根据用户可访问菜单动态生成路由（组件由 path 自动匹配 pages 目录） */
export function createAdminRouter(menus: AdminMenuNode[]) {
  const leafMenus = flattenLeafMenus(menus).filter((m) => m.path && getPageByPath(m.path));
  const defaultPath = leafMenus[0]?.path ?? 'dashboard';

  const adminTabRoutes: RouteObject[] = leafMenus.map((m) => ({
    path: m.path!,
    Component: getPageByPath(m.path)!,
    shouldRevalidate: keepLoaderData,
  }));

  // 确保 dashboard 始终可访问，避免菜单未就绪时 /dashboard 匹配不到任何子路由导致空白
  const registeredPaths = new Set(adminTabRoutes.map((r) => r.path));
  const dashboardPage = getPageByPath('dashboard');
  if (dashboardPage && !registeredPaths.has('dashboard')) {
    adminTabRoutes.unshift({
      path: 'dashboard',
      Component: dashboardPage,
      shouldRevalidate: keepLoaderData,
    });
  }

  return createBrowserRouter(
    [
      { path: '/login', Component: LoginRoute },
      {
        Component: RequireAuth,
        children: [
          {
            Component: PageTitleGuard,
            children: [
              {
                Component: AdminLayout,
                children: [
                  { index: true, element: <Navigate to={`/${defaultPath}`} replace /> },
                  ...adminTabRoutes,
                  ...buildHiddenAdminRoutes(),
                  { path: '403', Component: ForbiddenPage },
                ],
              },
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to={`/${defaultPath}`} replace /> },
    ],
    { basename: getRouterBasename() },
  );
}
