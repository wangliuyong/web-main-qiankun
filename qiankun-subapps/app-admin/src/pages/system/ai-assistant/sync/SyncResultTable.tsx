import type { SourceSyncResult } from '../../../../api/ai.api';
import { TechTable } from '../../../../components/tech-ui';
import { SYNC_RESULT_COLUMNS } from './syncResultColumns';

export interface SyncResultTableProps {
  results: SourceSyncResult[];
}

/** 同步结果汇总表 */
export default function SyncResultTable({ results }: SyncResultTableProps) {
  return (
    <div style={{ marginTop: 16 }}>
      <TechTable columns={SYNC_RESULT_COLUMNS} dataSource={results} pagination={false} />
    </div>
  );
}
