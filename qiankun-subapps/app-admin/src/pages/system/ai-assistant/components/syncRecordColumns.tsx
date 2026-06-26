import type { AiSyncRecord } from '../../../../api/ai.api';
import { TechBadge } from '../../../../components/tech-ui';
import type { TechColumn } from '../../../../components/tech-ui';
import { formatSyncRecordSources } from '../utils/formatSyncRecordSources';

/** 最近同步记录表格列 */
export const SYNC_RECORD_COLUMNS: TechColumn<AiSyncRecord>[] = [
  {
    key: 'sources',
    title: '同步范围',
    dataIndex: 'sources',
    render: (sources) => {
      const parts = formatSyncRecordSources(sources as AiSyncRecord['sources']);
      if (!parts.length) return '-';
      return (
        <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {parts.map((p) => (
            <TechBadge key={p.label}>
              {p.count > 0 ? `${p.label}(${p.count}条)` : p.label}
            </TechBadge>
          ))}
        </span>
      );
    },
  },
  {
    key: 'status',
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (v) => {
      const status = v as string;
      const variant =
        status === 'success' ? 'success' : status === 'partial' ? 'warning' : 'info';
      return <TechBadge variant={variant}>{status}</TechBadge>;
    },
  },
  { key: 'chunkCount', title: '向量块数', dataIndex: 'chunkCount', width: 100 },
  {
    key: 'startedAt',
    title: '开始时间',
    dataIndex: 'startedAt',
    width: 170,
    render: (v) => new Date(v as string).toLocaleString(),
  },
  {
    key: 'error',
    title: '错误',
    dataIndex: 'error',
    ellipsis: true,
    render: (v) => (v as string | null) ?? '-',
  },
];
