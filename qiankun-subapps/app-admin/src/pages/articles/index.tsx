import { FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Table, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  AdminPageShell,
  AdminPopconfirm,
  AdminSectionCard,
  ADMIN_TABLE_DEFAULTS,
  adminTableActionColumnProps,
  mergeAdminTablePagination,
} from '../../components/admin-page';
import { deleteArticle } from '../../api/articles.api';
import PageLoading from '../../components/_common/PageLoading';
import PermissionGuard from '../../components/PermissionGuard';
import { TechTableAction, TechTableActions } from '../../components/tech-ui';
import type { Article } from '../../types';
import { ARTICLE_PERMISSIONS, ARTICLE_ROUTES } from './constants';
import { ARTICLE_COLUMNS } from './components/articleColumns';
import { useArticles } from './useArticles';

/** 路由 articles — 博客列表（新建/编辑跳转独立页面） */
export default function ArticlesPage() {
  const navigate = useNavigate();
  const { articles, loading, reload } = useArticles();

  if (loading) {
    return <PageLoading />;
  }

  const handleDelete = async (id: number) => {
    await deleteArticle(id);
    message.success('已删除');
    reload();
  };

  const categoryCount = new Set(articles.map((a) => a.category).filter(Boolean)).size;

  return (
    <AdminPageShell
      title="博客管理"
      description="管理站点文章列表，新建与编辑在独立页面完成"
      stats={[
        {
          label: '文章总数',
          value: articles.length,
          icon: <FileTextOutlined />,
          accent: 'primary',
        },
        {
          label: '分类数',
          value: categoryCount,
          hint: categoryCount > 0 ? '已使用分类' : '暂无分类',
        },
      ]}
      extra={
        <PermissionGuard code={ARTICLE_PERMISSIONS.create}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(ARTICLE_ROUTES.create)}
          >
            新建文章
          </Button>
        </PermissionGuard>
      }
    >
      <AdminSectionCard noPadding>
        <Table<Article>
          rowKey="id"
          size={ADMIN_TABLE_DEFAULTS.size}
          className={ADMIN_TABLE_DEFAULTS.className}
          scroll={ADMIN_TABLE_DEFAULTS.scroll}
          columns={[
            ...ARTICLE_COLUMNS,
            {
              title: '操作',
              ...adminTableActionColumnProps,
              render: (_, record) => (
                <TechTableActions>
                  <PermissionGuard code={ARTICLE_PERMISSIONS.update}>
                    <TechTableAction onClick={() => navigate(ARTICLE_ROUTES.edit(record.id))}>
                      编辑
                    </TechTableAction>
                  </PermissionGuard>
                  <PermissionGuard code={ARTICLE_PERMISSIONS.delete}>
                    <AdminPopconfirm
                      title="确定删除该文章？"
                      onConfirm={() => void handleDelete(record.id)}
                    >
                      <TechTableAction variant="danger">删除</TechTableAction>
                    </AdminPopconfirm>
                  </PermissionGuard>
                </TechTableActions>
              ),
            },
          ]}
          dataSource={articles}
          pagination={mergeAdminTablePagination({ total: articles.length })}
        />
      </AdminSectionCard>
    </AdminPageShell>
  );
}
