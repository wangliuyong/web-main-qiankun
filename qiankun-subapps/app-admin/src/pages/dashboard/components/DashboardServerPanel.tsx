import { TechBadge, TechCard, TechIcon, TechProgress } from '../../../components/tech-ui';
import type { DashboardOverview } from '../types';
import { formatBytes, formatUptime } from '../utils/formatters';
import DashboardKvList, { type DashboardKvItem } from './DashboardKvList';

interface DashboardServerPanelProps {
  server: DashboardOverview['server'];
  ai: DashboardOverview['ai'];
}

/** 服务器运行时与 AI 同步状态 */
export default function DashboardServerPanel({ server, ai }: DashboardServerPanelProps) {
  const memoryPercent = Math.round((server.memory.usedMb / server.memory.totalMb) * 100);

  const syncVariant =
    ai.lastSyncStatus === 'success'
      ? 'success'
      : ai.lastSyncStatus === 'partial'
        ? 'warning'
        : ai.lastSyncStatus === 'running'
          ? 'info'
          : 'default';

  const serverItems: DashboardKvItem[] = [
    { key: 'hostname', label: '主机名', value: server.hostname, breakValue: true },
    { key: 'env', label: '运行环境', value: <TechBadge variant="accent">{server.env}</TechBadge>, wrapValue: true },
    { key: 'platform', label: '系统', value: server.platform, breakValue: true },
    { key: 'arch', label: '架构', value: server.arch },
    { key: 'node', label: 'Node', value: server.nodeVersion },
    { key: 'uptime', label: '进程运行', value: formatUptime(server.uptimeSeconds) },
    { key: 'rss', label: '进程内存', value: `${server.memory.rssMb} MB (RSS)` },
    { key: 'db', label: '数据库大小', value: formatBytes(server.databaseSizeBytes) },
  ];

  const aiItems: DashboardKvItem[] = [
    {
      key: 'configured',
      label: '配置状态',
      value: (
        <TechBadge variant={ai.configured ? 'success' : 'default'}>
          {ai.configured ? '已配置' : '未配置'}
        </TechBadge>
      ),
      wrapValue: true,
    },
    { key: 'chunks', label: '向量块数', value: ai.vectorChunkCount, emphasize: true },
    {
      key: 'sync',
      label: '最近同步',
      value: ai.lastSyncAt ? (
        <span className="dashboard-kv__inline">
          <TechBadge variant={syncVariant}>{ai.lastSyncStatus ?? '未知'}</TechBadge>
          <span className="dashboard-muted">{ai.lastSyncAt.slice(0, 19).replace('T', ' ')}</span>
        </span>
      ) : (
        '暂无记录'
      ),
      wrapValue: true,
    },
  ];

  return (
    <TechCard
      title={
        <>
          <TechIcon icon="mdi:server" size={18} />
          服务器信息
        </>
      }
    >
      <DashboardKvList items={serverItems} />
      <div style={{ margin: '16px 0', paddingTop: 4, borderTop: '1px solid var(--ta-line)' }}>
        <TechProgress
          percent={memoryPercent}
          status={memoryPercent > 85 ? 'danger' : 'normal'}
          label={`系统内存 ${server.memory.usedMb} / ${server.memory.totalMb} MB`}
        />
      </div>
      <div style={{ marginTop: 4, paddingTop: 12, borderTop: '1px solid var(--ta-line)' }}>
        <div style={{ marginBottom: 10, fontSize: 14, fontWeight: 600 }}>AI 小助手</div>
        <DashboardKvList items={aiItems} />
      </div>
    </TechCard>
  );
}
