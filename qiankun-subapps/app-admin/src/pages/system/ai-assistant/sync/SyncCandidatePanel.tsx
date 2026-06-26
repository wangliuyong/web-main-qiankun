import {
  AI_SOURCE_OPTIONS,
  type AiDataSource,
  type SyncCandidateItem,
} from '../../../../api/ai.api';
import { TechInput, TechTable, TechTabs } from '../../../../components/tech-ui';
import { SYNC_CANDIDATE_COLUMNS } from './syncCandidateColumns';

export interface SyncCandidatePanelProps {
  activeSource: AiDataSource;
  onActiveSourceChange: (source: AiDataSource) => void;
  selection: Record<AiDataSource, string[]>;
  onSelectionChange: (source: AiDataSource, keys: string[]) => void;
  candidates: SyncCandidateItem[];
  loading: boolean;
  keyword: string;
  onKeywordChange: (value: string) => void;
}

/** 向量化弹窗内：Tab + 搜索 + 候选记录多选表 */
export default function SyncCandidatePanel({
  activeSource,
  onActiveSourceChange,
  selection,
  onSelectionChange,
  candidates,
  loading,
  keyword,
  onKeywordChange,
}: SyncCandidatePanelProps) {
  const tabItems = AI_SOURCE_OPTIONS.map((opt) => {
    const count = selection[opt.value]?.length ?? 0;
    return {
      key: opt.value,
      label: count > 0 ? `${opt.label} (${count})` : opt.label,
    };
  });

  return (
    <div className="ai-sync-panel">
      <TechTabs
        activeKey={activeSource}
        items={tabItems}
        onChange={(key) => {
          onActiveSourceChange(key as AiDataSource);
          onKeywordChange('');
        }}
      />
      <TechInput
        prefixIcon="mdi:magnify"
        placeholder="搜索标题或说明"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
      />
      <TechTable
        rowKey="id"
        loading={loading}
        columns={SYNC_CANDIDATE_COLUMNS}
        dataSource={candidates}
        rowSelection={{
          selectedRowKeys: selection[activeSource],
          onChange: (keys) => onSelectionChange(activeSource, keys),
        }}
        pagination={{ pageSize: 8 }}
        scroll={{ y: 320 }}
        emptyText="该数据源下暂无可同步数据"
      />
    </div>
  );
}
