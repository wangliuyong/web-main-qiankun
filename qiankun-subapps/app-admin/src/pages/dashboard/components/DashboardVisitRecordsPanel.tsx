import dayjs from 'dayjs';
import { TechBadge, TechCard, TechEmpty, TechIcon, TechTable } from '../../../components/tech-ui';
import type { TechColumn } from '../../../components/tech-ui';
import type { DashboardOverview } from '../types';

interface DashboardVisitRecordsPanelProps {
  records: DashboardOverview['recentPageViews'];
}

const DEVICE_LABELS: Record<string, string> = {
  desktop: '桌面',
  mobile: '手机',
  tablet: '平板',
};

type Row = DashboardOverview['recentPageViews'][number];

/** app-web 最近访问记录 */
export default function DashboardVisitRecordsPanel({ records }: DashboardVisitRecordsPanelProps) {
  const columns: TechColumn<Row>[] = [
    {
      key: 'time',
      title: '时间',
      dataIndex: 'createdAt',
      width: 148,
      render: (v) => dayjs(v as string).format('MM-DD HH:mm:ss'),
    },
    {
      key: 'path',
      title: '页面',
      dataIndex: 'path',
      width: 120,
      render: (path) => <code className="dashboard-visit-path">{path as string}</code>,
    },
    {
      key: 'ip',
      title: 'IP',
      dataIndex: 'ip',
      width: 130,
      render: (ip) => (ip as string | null) ?? '-',
    },
    {
      key: 'region',
      title: '地区',
      dataIndex: 'region',
      ellipsis: true,
      render: (region) => (region as string | null) ?? '未知',
    },
    {
      key: 'browser',
      title: '浏览器',
      dataIndex: 'browser',
      width: 96,
      render: (v) => (v as string | null) ?? '-',
    },
    {
      key: 'os',
      title: '系统',
      dataIndex: 'os',
      width: 88,
      render: (v) => (v as string | null) ?? '-',
    },
    {
      key: 'device',
      title: '设备',
      dataIndex: 'device',
      width: 72,
      render: (device) => {
        const d = device as string | null;
        return d ? DEVICE_LABELS[d] ?? d : '-';
      },
    },
    {
      key: 'locale',
      title: '语言 / 时区',
      width: 160,
      ellipsis: true,
      render: (_, row) => {
        const parts = [row.locale, row.timezone].filter(Boolean);
        return parts.length > 0 ? parts.join(' / ') : '-';
      },
    },
  ];

  return (
    <TechCard
      title={
        <>
          <TechIcon icon="mdi:earth" size={18} />
          访问记录
        </>
      }
      extra={<TechBadge>仅统计 /about · /projects · /contact · /links</TechBadge>}
    >
      {records.length === 0 ? (
        <TechEmpty description="暂无访问记录，浏览 app-web 页面后将自动采集" />
      ) : (
        <TechTable columns={columns} dataSource={records} pagination={false} />
      )}
    </TechCard>
  );
}
