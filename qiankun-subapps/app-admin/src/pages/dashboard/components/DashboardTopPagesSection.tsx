import { useMemo } from 'react';
import {
  TechBadge,
  TechCard,
  TechEmpty,
  TechIcon,
  TechProgress,
  TechTable,
} from '../../../components/tech-ui';
import type { TechColumn } from '../../../components/tech-ui';
import type { DashboardOverview } from '../types';
import { formatAppWebPageLabel } from '../utils/pagePaths';
import DashboardEChart from './charts/DashboardEChart';
import { buildTopPagesOption } from '../utils/chartOptions';

interface DashboardTopPagesSectionProps {
  topPages: DashboardOverview['charts']['topPages'];
}

/** 表格行：本周热门页面排行 */
interface TopPageRow {
  id: string;
  rank: number;
  path: string;
  label: string;
  views: number;
  /** 占本周总 PV 的百分比（0-100） */
  sharePercent: number;
}

/** 根据排名返回徽章样式：前三名高亮 */
function rankBadgeVariant(rank: number): 'accent' | 'warning' | 'info' | 'default' {
  if (rank === 1) return 'accent';
  if (rank === 2) return 'warning';
  if (rank === 3) return 'info';
  return 'default';
}

/** 首页「本周热门页面」独立区块：排行表 + 横向柱状图 */
export default function DashboardTopPagesSection({ topPages }: DashboardTopPagesSectionProps) {
  /** 汇总本周各页 PV，用于计算占比 */
  const totalViews = useMemo(
    () => topPages.reduce((sum, item) => sum + item.views, 0),
    [topPages],
  );

  /** 构造表格数据源（按访问量降序，与后端一致） */
  const rows = useMemo<TopPageRow[]>(
    () =>
      topPages.map((item, index) => ({
        id: item.path,
        rank: index + 1,
        path: item.path,
        label: formatAppWebPageLabel(item.path),
        views: item.views,
        sharePercent: totalViews > 0 ? Math.round((item.views / totalViews) * 1000) / 10 : 0,
      })),
    [topPages, totalViews],
  );

  const columns: TechColumn<TopPageRow>[] = [
    {
      key: 'rank',
      title: '排名',
      dataIndex: 'rank',
      width: 64,
      render: (rank) => (
        <TechBadge variant={rankBadgeVariant(rank as number)}>#{rank as number}</TechBadge>
      ),
    },
    {
      key: 'page',
      title: '页面',
      dataIndex: 'label',
      render: (_, row) => (
        <div className="dashboard-top-pages__page">
          <span className="dashboard-top-pages__page-name">{row.label}</span>
          <code className="dashboard-visit-path">{row.path}</code>
        </div>
      ),
    },
    {
      key: 'views',
      title: '访问量',
      dataIndex: 'views',
      width: 88,
      render: (views) => (
        <span className="dashboard-top-pages__views">{views as number}</span>
      ),
    },
    {
      key: 'share',
      title: '占比',
      width: 160,
      render: (_, row) => (
        <div className="dashboard-top-pages__share">
          <TechProgress percent={row.sharePercent} label={`${row.sharePercent}%`} />
        </div>
      ),
    },
  ];

  return (
    <TechCard
      title={
        <>
          <TechIcon icon="mdi:fire" size={18} />
          本周热门页面
        </>
      }
      extra={
        totalViews > 0 ? (
          <TechBadge variant="info">本周合计 {totalViews} 次访问</TechBadge>
        ) : (
          <TechBadge>仅统计 app-web 前台页面</TechBadge>
        )
      }
    >
      {rows.length === 0 ? (
        <TechEmpty description="暂无访问记录，浏览 app-web 前台页面后将自动统计" />
      ) : (
        <div className="dashboard-top-pages">
          <div className="dashboard-top-pages__chart">
            <DashboardEChart
              option={buildTopPagesOption(topPages)}
              height={Math.max(200, topPages.length * 44)}
            />
          </div>
          <div className="dashboard-top-pages__table">
            <TechTable columns={columns} dataSource={rows} rowKey="id" pagination={false} />
          </div>
        </div>
      )}
    </TechCard>
  );
}
