/** 管理页首屏加载占位 */
export default function PageLoading() {
  return (
    <div className="admin-page-loading" role="status" aria-label="加载中">
      <div className="admin-page-loading__spinner" />
      <p className="admin-page-loading__text">加载中...</p>
    </div>
  );
}
