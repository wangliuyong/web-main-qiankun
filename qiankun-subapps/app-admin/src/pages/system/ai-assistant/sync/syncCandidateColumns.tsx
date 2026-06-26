import type { SyncCandidateItem } from '../../../../api/ai.api';
import type { TechColumn } from '../../../../components/tech-ui';

/** 同步候选记录表格列 */
export const SYNC_CANDIDATE_COLUMNS: TechColumn<SyncCandidateItem>[] = [
  { key: 'title', title: '标题', dataIndex: 'title', ellipsis: true },
  {
    key: 'subtitle',
    title: '说明',
    dataIndex: 'subtitle',
    ellipsis: true,
    render: (v) => (v as string | undefined) ?? '-',
  },
];
