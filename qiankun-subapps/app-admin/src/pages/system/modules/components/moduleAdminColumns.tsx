import { Popconfirm, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PermissionGuard from '../../../../components/PermissionGuard';
import { TechTableAction, TechTableActions } from '../../../../components/tech-ui';
import { isMenuGroup, isPageMenu, type ModuleAdminTreeNode } from '../../../../router/moduleTreeUtils';
import { isPathRegistered } from '../../../../router/pageRegistry';
import type { AdminModuleRecord } from '../../../../types/rbac';

export interface ModuleAdminColumnHandlers {
  modules: AdminModuleRecord[];
  onOpenChildMenu: (parent: AdminModuleRecord) => void;
  onOpenPermCreate: (parent: AdminModuleRecord) => void;
  onOpenPermEdit: (
    parent: AdminModuleRecord,
    perm: { id: number; name: string; code: string; sort: number },
  ) => void;
  onOpenMenuEdit: (record: AdminModuleRecord) => void;
  onDeletePermission: (permissionId: number) => void;
  onDeleteModule: (moduleId: number) => void;
}

/** 模块管理树表列定义 */
export function createModuleAdminColumns(
  handlers: ModuleAdminColumnHandlers,
): ColumnsType<ModuleAdminTreeNode> {
  const {
    modules,
    onOpenChildMenu,
    onOpenPermCreate,
    onOpenPermEdit,
    onOpenMenuEdit,
    onDeletePermission,
    onDeleteModule,
  } = handlers;

  return [
    { title: '名称', dataIndex: 'name', width: 200 },
    { title: '编码', dataIndex: 'code', width: 200 },
    {
      title: '类型',
      dataIndex: 'type',
      width: 90,
      render: (v: string) =>
        v === 'permission' ? <Tag color="orange">权限点</Tag> : <Tag color="blue">菜单</Tag>,
    },
    {
      title: '路由',
      dataIndex: 'path',
      width: 200,
      render: (v: string | null | undefined, row) => {
        if (row.type === 'permission') return '—';
        if (!v) return '（分组）';
        return (
          <Space size={4}>
            <span>{v}</span>
            {isPathRegistered(v) ? (
              <Tag color="green">已匹配</Tag>
            ) : (
              <Tag color="red">未找到页面</Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (v: number | undefined, row) =>
        row.type === 'permission' ? '—' : v === 1 ? <Tag color="green">启用</Tag> : <Tag>禁用</Tag>,
    },
    {
      title: '操作',
      render: (_, record) => {
        if (record.type === 'permission') {
          return (
            <TechTableActions>
              <PermissionGuard code="admin:system:modules:update">
                <TechTableAction
                  onClick={() => {
                    const parent = modules.find((m) => m.id === record.moduleId);
                    if (!parent) return;
                    onOpenPermEdit(parent, {
                      id: record.permissionId!,
                      name: record.name,
                      code: record.code,
                      sort: record.sort ?? 0,
                    });
                  }}
                >
                  编辑
                </TechTableAction>
              </PermissionGuard>
              <PermissionGuard code="admin:system:modules:delete">
                <Popconfirm
                  title="确定删除该权限点？"
                  onConfirm={() => onDeletePermission(record.permissionId!)}
                >
                  <TechTableAction variant="danger">删除</TechTableAction>
                </Popconfirm>
              </PermissionGuard>
            </TechTableActions>
          );
        }

        const menuRecord = modules.find((m) => m.id === record.moduleId);

        return (
          <TechTableActions>
            {menuRecord && isMenuGroup(menuRecord) && (
              <PermissionGuard code="admin:system:modules:create">
                <TechTableAction onClick={() => onOpenChildMenu(menuRecord)}>新增</TechTableAction>
              </PermissionGuard>
            )}
            {menuRecord && isPageMenu(menuRecord) && (
              <PermissionGuard code="admin:system:modules:update">
                <TechTableAction onClick={() => onOpenPermCreate(menuRecord)}>新增</TechTableAction>
              </PermissionGuard>
            )}
            <PermissionGuard code="admin:system:modules:update">
              <TechTableAction onClick={() => menuRecord && onOpenMenuEdit(menuRecord)}>
                编辑
              </TechTableAction>
            </PermissionGuard>
            <PermissionGuard code="admin:system:modules:delete">
              <Popconfirm
                title="确定删除？请先删除子菜单"
                onConfirm={() => onDeleteModule(record.moduleId!)}
              >
                <TechTableAction variant="danger">删除</TechTableAction>
              </Popconfirm>
            </PermissionGuard>
          </TechTableActions>
        );
      },
    },
  ];
}
