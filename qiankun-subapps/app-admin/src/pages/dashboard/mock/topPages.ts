import type { DashboardOverview } from '../types';

/** 开发环境演示用：本周热门页面 mock 数据（与 nest-server page-views-seed 权重一致） */
export const MOCK_TOP_PAGES: DashboardOverview['charts']['topPages'] = [
  { path: '/about', views: 42 },
  { path: '/projects', views: 31 },
  { path: '/contact', views: 18 },
  { path: '/links', views: 9 },
];

/** 本周 mock 总 PV，用于补齐 visit / interaction 相关字段 */
const MOCK_WEEK_PV = MOCK_TOP_PAGES.reduce((sum, item) => sum + item.views, 0);

/**
 * 开发环境下，当接口未返回热门页面数据时注入 mock，
 * 便于本地预览「本周热门页面」区块 UI。
 */
export function applyMockTopPagesIfEmpty(overview: DashboardOverview): DashboardOverview {
  if (overview.charts.topPages.length > 0) {
    return overview;
  }

  return {
    ...overview,
    visit: {
      ...overview.visit,
      week: overview.visit.week > 0 ? overview.visit.week : MOCK_WEEK_PV,
      today: overview.visit.today > 0 ? overview.visit.today : MOCK_TOP_PAGES[0].views,
    },
    interaction: {
      ...overview.interaction,
      pageViewsThisWeek:
        overview.interaction.pageViewsThisWeek > 0
          ? overview.interaction.pageViewsThisWeek
          : MOCK_WEEK_PV,
      topPageThisWeek: overview.interaction.topPageThisWeek ?? MOCK_TOP_PAGES[0],
    },
    charts: {
      ...overview.charts,
      topPages: MOCK_TOP_PAGES,
    },
  };
}
