import { TechIcon, TechStatCard } from '../../../components/tech-ui';
import type { DashboardOverview } from '../types';

interface DashboardContentStatsProps {
  content: DashboardOverview['content'];
  visit: DashboardOverview['visit'];
}

/** 站点核心指标卡片 */
export default function DashboardContentStats({ content, visit }: DashboardContentStatsProps) {
  const items = [
    {
      key: 'pv-today',
      label: '今日 app-web 访问',
      value: visit.today,
      icon: 'mdi:eye-outline',
      accent: true,
    },
    { key: 'pv-week', label: '本周访问', value: visit.week, icon: 'mdi:chart-timeline-variant' },
    {
      key: 'articles',
      label: '博客文章',
      value: content.articles,
      hint: content.articlesThisMonth > 0 ? `本月 +${content.articlesThisMonth}` : undefined,
      icon: 'mdi:book-open-page-variant-outline',
    },
    { key: 'projects', label: '项目作品', value: content.projects, icon: 'mdi:briefcase-outline' },
    { key: 'links', label: '友情链接', value: content.links, icon: 'mdi:link-variant' },
    { key: 'messages', label: '访客留言', value: content.messages, icon: 'mdi:comment-outline' },
  ];

  return (
    <div className="dashboard-stats-grid">
      {items.map((item) => (
        <TechStatCard
          key={item.key}
          label={item.label}
          value={item.value}
          hint={item.hint}
          accent={item.accent}
          icon={<TechIcon icon={item.icon} size={28} />}
        />
      ))}
    </div>
  );
}
