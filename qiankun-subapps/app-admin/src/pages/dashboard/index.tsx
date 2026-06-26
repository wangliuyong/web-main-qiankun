import PageLoading from '../../components/_common/PageLoading';
import {
  TechButton,
  TechConfirm,
} from '../../components/tech-ui';
import DashboardSortableLayout from './components/DashboardSortableLayout';
import { useDashboardOverview } from './hooks/useDashboardOverview';
import { useDashboardSectionOrder } from './hooks/useDashboardSectionOrder';
import './styles/dashboard.scss';

/** 路由 dashboard — 管理后台首页概览（支持卡片拖拽排序） */
export default function DashboardPage() {
  const { overview, loading, reload } = useDashboardOverview();
  const { order, isEditing, setIsEditing, reorder, resetOrder } = useDashboardSectionOrder();

  if (loading || !overview) {
    return <PageLoading />;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero">
        <div className="dashboard-hero__copy">
          <h1 className="dashboard-hero__title">{overview.site.siteName}</h1>
          <p className="dashboard-hero__subtitle">
            访问、内容概况与服务器状态一屏掌握
          </p>
        </div>
        <div className="dashboard-hero__actions">
          {isEditing ? (
            <>
              <TechConfirm title="恢复默认顺序？" onConfirm={resetOrder} okText="恢复">
                <TechButton variant="ghost">恢复默认</TechButton>
              </TechConfirm>
              <TechButton variant="primary" onClick={() => setIsEditing(false)}>
                完成编辑
              </TechButton>
            </>
          ) : (
            null
          )}
          <TechButton icon="mdi:refresh" onClick={() => void reload()}>
            刷新数据
          </TechButton>
        </div>
      </header>

      <DashboardSortableLayout
        order={order}
        isEditing={isEditing}
        overview={overview}
        onReorder={reorder}
      />
    </div>
  );
}
