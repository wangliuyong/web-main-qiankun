import { useMemo, useState, type ReactNode } from 'react';
import { Form, Table, type FormInstance } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  AdminPageShell,
  AdminSectionCard,
  ADMIN_TABLE_DEFAULTS,
  mergeAdminTablePagination,
  type AdminStatItem,
} from './admin-page';
import PageLoading from './_common/PageLoading';
import PermissionGuard from './PermissionGuard';
import {
  TechButton,
  TechConfirm,
  TechModal,
  TechIcon,
  techToast,
} from './tech-ui';

export interface AdminCrudPageProps<T extends { id: number }> {
  title: string;
  /** 页面功能说明 */
  description?: string;
  createLabel: string;
  data: T[];
  loading: boolean;
  columns: ColumnsType<T>;
  deleteConfirmTitle: string;
  modalTitles: { create: string; edit: string };
  modalWidth?: number;
  renderForm: (form: FormInstance) => ReactNode;
  onCreate: (values: Record<string, unknown>) => Promise<void>;
  onUpdate: (id: number, values: Record<string, unknown>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onReload: () => void;
  /** 按钮级权限码 */
  createPermission?: string;
  updatePermission?: string;
  deletePermission?: string;
  /** 操作列额外按钮 */
  extraActions?: (record: T) => ReactNode;
  /** 自定义统计指标（默认展示总记录数） */
  stats?: AdminStatItem[];
  /** 是否展示总记录数统计，默认 true */
  showTotalStat?: boolean;
  /** 表格上方工具区（筛选等） */
  toolbar?: ReactNode;
}

/** 后台标准 CRUD 页壳：Hero + 统计 + Table + Modal Form + 权限控制 */
export default function AdminCrudPage<T extends { id: number }>({
  title,
  description,
  createLabel,
  data,
  loading,
  columns,
  deleteConfirmTitle,
  modalTitles,
  modalWidth = 560,
  renderForm,
  onCreate,
  onUpdate,
  onDelete,
  onReload,
  createPermission,
  updatePermission,
  deletePermission,
  extraActions,
  stats,
  showTotalStat = true,
  toolbar,
}: AdminCrudPageProps<T>) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<T> | null>(null);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const pageStats = useMemo(() => {
    const items: AdminStatItem[] = stats ? [...stats] : [];
    if (showTotalStat) {
      items.unshift({
        label: '总记录数',
        value: data.length,
        icon: <TechIcon icon="mdi:format-list-bulleted" size={18} />,
        accent: 'primary',
      });
    }
    return items;
  }, [data.length, showTotalStat, stats]);

  if (loading) return <PageLoading />;

  const openCreate = () => {
    setEditing({});
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: T) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      if (editing?.id) {
        await onUpdate(editing.id, values);
        techToast.success('已更新');
      } else {
        await onCreate(values);
        techToast.success('已创建');
      }
      setModalOpen(false);
      onReload();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    await onDelete(id);
    techToast.success('已删除');
    onReload();
  };

  const createBtn = (
    <TechButton variant="primary" icon="mdi:plus" onClick={openCreate}>
      {createLabel}
    </TechButton>
  );

  const actionColumn: ColumnsType<T>[number] = {
    title: '操作',
    width: extraActions ? 200 : 140,
    fixed: 'right',
    render: (_, record) => (
      <span style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap' }}>
        {extraActions?.(record)}
        <PermissionGuard code={updatePermission ?? ''}>
          <TechButton
            variant="ghost"
            icon="mdi:pencil-outline"
            onClick={() => openEdit(record)}
          >
            编辑
          </TechButton>
        </PermissionGuard>
        <PermissionGuard code={deletePermission ?? ''}>
          <TechConfirm title={deleteConfirmTitle} onConfirm={() => handleDelete(record.id)}>
            <TechButton variant="danger" icon="mdi:delete-outline">
              删除
            </TechButton>
          </TechConfirm>
        </PermissionGuard>
      </span>
    ),
  };

  return (
    <AdminPageShell
      title={title}
      description={description}
      stats={pageStats}
      extra={
        createPermission ? (
          <PermissionGuard code={createPermission}>{createBtn}</PermissionGuard>
        ) : (
          createBtn
        )
      }
    >
      <AdminSectionCard noPadding>
        {toolbar}
        <Table
          rowKey="id"
          columns={[...columns, actionColumn]}
          dataSource={data}
          size={ADMIN_TABLE_DEFAULTS.size}
          className={ADMIN_TABLE_DEFAULTS.className}
          scroll={{ x: 'max-content' }}
          pagination={mergeAdminTablePagination({ total: data.length })}
        />
      </AdminSectionCard>

      <TechModal
        open={modalOpen}
        title={editing?.id ? modalTitles.edit : modalTitles.create}
        onClose={() => setModalOpen(false)}
        onOk={() => void handleSave()}
        confirmLoading={saving}
        width={modalWidth}
      >
        <Form form={form} layout="vertical" className="admin-modal-form">
          {renderForm(form)}
        </Form>
      </TechModal>
    </AdminPageShell>
  );
}
