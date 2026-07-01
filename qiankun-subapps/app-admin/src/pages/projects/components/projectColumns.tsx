import type { ColumnsType } from 'antd/es/table';
import { getProjectCategoryLabel } from '../../../../../_shared/projectCategory';
import type { Project } from '../../../types';

export const PROJECT_COLUMNS: ColumnsType<Project> = [
  { title: '项目名称', dataIndex: 'name', width: 180 },
  {
    title: '类型',
    dataIndex: 'category',
    width: 100,
    render: (value: string | null) => getProjectCategoryLabel(value) ?? '-',
  },
  { title: '描述', dataIndex: 'desc', ellipsis: true },
  { title: '技术栈', dataIndex: 'techStack', width: 140 },
];
