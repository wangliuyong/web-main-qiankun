import { TechAlert, TechModal } from '../../../../components/tech-ui';
import SyncCandidatePanel from './SyncCandidatePanel';
import SyncResultTable from './SyncResultTable';
import { useSyncDataModal } from './useSyncDataModal';

export interface SyncDataModalProps {
  open: boolean;
  syncing: boolean;
  onSyncingChange: (syncing: boolean) => void;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

/** 向量化数据弹窗 */
export default function SyncDataModal({
  open,
  syncing,
  onSyncingChange,
  onClose,
  onSuccess,
}: SyncDataModalProps) {
  const {
    activeSource,
    setActiveSource,
    selection,
    keyword,
    setKeyword,
    syncResults,
    filteredList,
    totalSelected,
    loading,
    handleSelectionChange,
    handleConfirm,
  } = useSyncDataModal({ open, onSyncingChange, onClose, onSuccess });

  return (
    <TechModal
      open={open}
      title="选择要向量化的数据"
      width={720}
      onClose={() => !syncing && onClose()}
      onOk={handleConfirm}
      okText={totalSelected > 0 ? `同步已选 ${totalSelected} 条` : '确定同步'}
      okDisabled={totalSelected === 0}
      confirmLoading={syncing}
    >
      <TechAlert
        type="info"
        message="仅对勾选的记录生成/更新向量，不会默认同步全库数据。"
      />
      <SyncCandidatePanel
        activeSource={activeSource}
        onActiveSourceChange={setActiveSource}
        selection={selection}
        onSelectionChange={handleSelectionChange}
        candidates={filteredList}
        loading={loading}
        keyword={keyword}
        onKeywordChange={setKeyword}
      />
      {syncResults ? <SyncResultTable results={syncResults} /> : null}
    </TechModal>
  );
}
