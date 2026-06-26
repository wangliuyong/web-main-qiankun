import type { DashboardSectionId } from '../config/sectionTypes';
import type { DashboardOverview } from '../types';
import DashboardChartsSection from './DashboardChartsSection';
import DashboardContentStats from './DashboardContentStats';
import DashboardInteractionPanel from './DashboardInteractionPanel';
import DashboardQuickLinks from './DashboardQuickLinks';
import DashboardRecentPanel from './DashboardRecentPanel';
import DashboardServerPanel from './DashboardServerPanel';
import DashboardVisitRecordsPanel from './DashboardVisitRecordsPanel';

interface DashboardSectionRendererProps {
  sectionId: DashboardSectionId;
  overview: DashboardOverview;
  onNavigate: (path: string) => void;
}

/** 按区块 id 渲染对应首页卡片内容 */
export default function DashboardSectionRenderer({
  sectionId,
  overview,
  onNavigate,
}: DashboardSectionRendererProps) {
  switch (sectionId) {
    case 'stats':
      return <DashboardContentStats content={overview.content} visit={overview.visit} />;
    case 'charts':
      return <DashboardChartsSection charts={overview.charts} />;
    case 'visits':
      return <DashboardVisitRecordsPanel records={overview.recentPageViews} />;
    case 'panels':
      return (
        <div className="dashboard-panels-row">
          <DashboardInteractionPanel
            interaction={overview.interaction}
            logs={overview.logs}
            messagesTotal={overview.content.messages}
          />
          <DashboardServerPanel server={overview.server} ai={overview.ai} />
        </div>
      );
    case 'quickLinks':
      return <DashboardQuickLinks onNavigate={onNavigate} />;
    case 'recent':
      return <DashboardRecentPanel recent={overview.recent} />;
    default:
      return null;
  }
}
