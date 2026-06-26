import { useCallback, useEffect, useState } from 'react';
import { AdminPageShell, AdminSectionCard } from '../../../components/admin-page';
import PageLoading from '../../../components/_common/PageLoading';
import { TechButton, TechIcon } from '../../../components/tech-ui';
import { queryConvDashboardOverview } from '../../../api/convenience.api';
import type { ConvDashboardOverview } from '../../../types/convenience';

/** 路由 convenience/dashboard — 便民业务概览 */
export default function ConvDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ConvDashboardOverview | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await queryConvDashboardOverview());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !data) return <PageLoading />;

  return (
    <AdminPageShell
      title="便民业务概览"
      description="审核队列、用户规模与运营内容一屏总览，点击侧栏进入具体管理"
      extra={
        <TechButton icon="mdi:refresh" loading={loading} onClick={() => void load()}>
          刷新数据
        </TechButton>
      }
      stats={[
        {
          label: '待审核信息',
          value: data?.pendingAuditCount ?? 0,
          icon: <TechIcon icon="mdi:alert-circle-outline" size={18} />,
          accent: 'warning',
          hint: '需尽快处理',
        },
        {
          label: '已通过',
          value: data?.approvedInfoCount ?? 0,
          icon: <TechIcon icon="mdi:check-circle-outline" size={18} />,
          accent: 'success',
        },
        {
          label: '已驳回',
          value: data?.rejectedInfoCount ?? 0,
          icon: <TechIcon icon="mdi:close-circle-outline" size={18} />,
          accent: 'danger',
        },
        {
          label: 'C 端用户',
          value: data?.userCount ?? 0,
          icon: <TechIcon icon="mdi:account-group-outline" size={18} />,
          accent: 'primary',
        },
        {
          label: '举报记录',
          value: data?.reportCount ?? 0,
          icon: <TechIcon icon="mdi:flag-outline" size={18} />,
        },
        {
          label: '公告 / 轮播',
          value: `${data?.noticeCount ?? 0} / ${data?.bannerCount ?? 0}`,
          icon: <TechIcon icon="mdi:image-outline" size={18} />,
          hint: '公告数 / 在线轮播',
        },
      ]}
    >
      <AdminSectionCard title="运营提示">
        <p className="admin-hint-text">
          待审核信息优先从「便民信息审核」处理；举报记录可在「举报管理」查看；公告与轮播分别对应侧栏入口。
          上方指标每次进入页面自动拉取，也可点击右上角刷新。
        </p>
      </AdminSectionCard>
    </AdminPageShell>
  );
}
