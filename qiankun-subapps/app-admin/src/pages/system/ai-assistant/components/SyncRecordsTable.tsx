import type { AiSyncRecord } from '../../../../api/ai.api';
import { TechCard, TechTable } from '../../../../components/tech-ui';
import { SYNC_RECORD_COLUMNS } from './syncRecordColumns';

export interface SyncRecordsTableProps {
  records: AiSyncRecord[];
}

/** 最近同步记录内嵌表格 */
export default function SyncRecordsTable({ records }: SyncRecordsTableProps) {
  return (
    <TechCard title="最近同步记录" inner>
      <TechTable
        columns={SYNC_RECORD_COLUMNS}
        dataSource={records}
        pagination={{ pageSize: 5, total: records.length }}
        emptyText="暂无同步记录"
      />
    </TechCard>
  );
}
