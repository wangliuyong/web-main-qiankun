import { request } from '../../api/client';
import { applyMockTopPagesIfEmpty } from './mock/topPages';
import type { DashboardOverview } from './types';

/** 拉取首页概览聚合数据 */
export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  const overview = await request<DashboardOverview>('/admin/dashboard/overview');

  /** 开发环境无真实访问记录时，注入 mock 便于预览热门页面区块 */
  if (import.meta.env.DEV) {
    return applyMockTopPagesIfEmpty(overview);
  }

  return overview;
}
