import { AppTag } from '../../../../../_shared/components';
import { cn } from '../../../../../_shared/utils/cn';
import {
  getProjectCategoryLabel,
  isProjectCategory,
  type ProjectCategory,
} from '../../../../../_shared/projectCategory';

export interface ProjectCategoryTagProps {
  /** 项目分类原始值 */
  category: string | null;
  className?: string;
}

/** 作品集卡片上的个人/企业项目标签 */
export default function ProjectCategoryTag({ category, className }: ProjectCategoryTagProps) {
  const label = getProjectCategoryLabel(category);
  if (!label) return null;

  const categoryClass = isProjectCategory(category)
    ? (`app-tag--${category as ProjectCategory}` as const)
    : undefined;

  return (
    <AppTag className={cn('text-xs py-0.5 px-2.5', categoryClass, className)}>
      {label}
    </AppTag>
  );
}
