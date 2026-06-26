import {
  AI_SOURCE_OPTIONS,
  type AiDataSource,
  type SourceSyncResult,
} from '../../../../api/ai.api';
import { TechBadge } from '../../../../components/tech-ui';
import type { TechColumn } from '../../../../components/tech-ui';

/** 同步结果汇总表格列 */
export const SYNC_RESULT_COLUMNS: TechColumn<SourceSyncResult>[] = [
  {
    key: 'source',
    title: '数据源',
    dataIndex: 'source',
    width: 100,
    render: (s) => AI_SOURCE_OPTIONS.find((o) => o.value === (s as AiDataSource))?.label ?? String(s),
  },
  {
    key: 'ids',
    title: '记录数',
    dataIndex: 'ids',
    width: 80,
    render: (ids) => (ids as string[])?.length ?? 0,
  },
  { key: 'chunkCount', title: '向量块数', dataIndex: 'chunkCount', width: 90 },
  {
    key: 'error',
    title: '错误',
    dataIndex: 'error',
    render: (v) => (v ? <TechBadge variant="danger">{v as string}</TechBadge> : '-'),
  },
];
