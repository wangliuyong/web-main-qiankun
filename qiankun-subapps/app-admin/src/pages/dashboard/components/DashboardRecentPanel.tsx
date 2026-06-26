import dayjs from 'dayjs';
import { TechList } from '../../../components/tech-ui';
import type { DashboardOverview } from '../types';
import { truncateText } from '../utils/formatters';

interface DashboardRecentPanelProps {
  recent: DashboardOverview['recent'];
}

/** 最近留言、文章与审计动态 */
export default function DashboardRecentPanel({ recent }: DashboardRecentPanelProps) {
  return (
    <div className="dashboard-recent-grid">
      <div className="dashboard-recent-block">
        <h3 className="dashboard-recent-block__title">最新留言</h3>
        <TechList
          emptyText="暂无留言"
          dataSource={recent.messages.map((item) => ({
            key: String(item.id),
            title: item.nickname,
            description: (
              <>
                <div>{truncateText(item.content, 56)}</div>
                <span className="dashboard-muted">
                  {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}
                </span>
              </>
            ),
          }))}
        />
      </div>
      <div className="dashboard-recent-block">
        <h3 className="dashboard-recent-block__title">最新文章</h3>
        <TechList
          emptyText="暂无文章"
          dataSource={recent.articles.map((item) => ({
            key: String(item.id),
            title: item.title,
            description: (
              <span className="dashboard-muted">
                {dayjs(item.publishedAt).format('YYYY-MM-DD HH:mm')}
              </span>
            ),
          }))}
        />
      </div>
      <div className="dashboard-recent-block">
        <h3 className="dashboard-recent-block__title">最近操作</h3>
        <TechList
          emptyText="暂无审计记录"
          dataSource={recent.auditLogs.map((item) => ({
            key: String(item.id),
            title: `${item.username ?? '系统'} - ${item.action}`,
            description: (
              <>
                {item.module ? <span>{item.module} </span> : null}
                <span className="dashboard-muted">
                  {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}
                </span>
              </>
            ),
          }))}
        />
      </div>
    </div>
  );
}
