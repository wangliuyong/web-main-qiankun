import { TechCard } from '../../../components/tech-ui';
import type { DashboardOverview } from '../types';
import DashboardEChart from './charts/DashboardEChart';
import {
  buildContentMixOption,
  buildTopPagesOption,
  buildVisitTrendOption,
} from '../utils/chartOptions';

interface DashboardChartsSectionProps {
  charts: DashboardOverview['charts'];
}

/** 访问趋势与页面分布图表区 */
export default function DashboardChartsSection({ charts }: DashboardChartsSectionProps) {
  return (
    <section className="dashboard-charts">
      <div className="dashboard-charts__row">
        <TechCard title="近 14 天访问与互动趋势">
          <DashboardEChart option={buildVisitTrendOption(charts.dailyTrend)} height={320} />
        </TechCard>
        <TechCard title="站点内容构成">
          <DashboardEChart option={buildContentMixOption(charts.contentMix)} height={320} />
        </TechCard>
      </div>
      <TechCard title="本周热门页面">
        {charts.topPages.length > 0 ? (
          <DashboardEChart
            option={buildTopPagesOption(charts.topPages)}
            height={Math.max(220, charts.topPages.length * 42)}
          />
        ) : (
          <div className="dashboard-chart__empty">暂无访问记录，浏览前台页面后将自动统计</div>
        )}
      </TechCard>
    </section>
  );
}
