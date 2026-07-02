import { Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { KnowledgeChunkItem } from '../../../../api/ai.api';
import PermissionGuard from '../../../../components/PermissionGuard';
import { AdminPopconfirm, adminTableActionColumnProps } from '../../../../components/admin-page';
import { TechTableAction, TechTableActions } from '../../../../components/tech-ui';
import { SOURCE_LABEL } from '../constants';

export interface KnowledgeChunkColumnHandlers {
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

/** 知识库向量块表格列定义 */
export function createKnowledgeChunkColumns(
  handlers: KnowledgeChunkColumnHandlers,
): ColumnsType<KnowledgeChunkItem> {
  return [
    {
      title: '数据源',
      dataIndex: 'source',
      width: 100,
      render: (s: string) => <Tag>{SOURCE_LABEL[s] ?? s}</Tag>,
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 160,
      ellipsis: true,
      render: (v: string) => v || '-',
    },
    {
      title: '来源 ID',
      dataIndex: 'sourceId',
      width: 90,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      width: 120,
      ellipsis: true,
      render: (v: string) => v || '-',
    },
    {
      title: '文本预览',
      dataIndex: 'textPreview',
      ellipsis: true,
    },
    {
      title: '字数',
      dataIndex: 'textLength',
      width: 72,
      render: (n: number) => `${n}`,
    },
    {
      title: '操作',
      ...adminTableActionColumnProps,
      render: (_, record) => (
        <TechTableActions>
          <TechTableAction onClick={() => handlers.onView(record.id)}>查看</TechTableAction>
          <PermissionGuard code="admin:ai-knowledge:delete">
            <AdminPopconfirm
              title="确定删除该向量块？删除后需重新同步数据源才能恢复检索。"
              onConfirm={() => handlers.onDelete(record.id)}
            >
              <TechTableAction variant="danger">删除</TechTableAction>
            </AdminPopconfirm>
          </PermissionGuard>
        </TechTableActions>
      ),
    },
  ];
}
