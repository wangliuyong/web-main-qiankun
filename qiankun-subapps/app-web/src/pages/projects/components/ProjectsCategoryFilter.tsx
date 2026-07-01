import { AppButton } from '../../../../../_shared/components';
import { cn } from '../../../../../_shared/utils/cn';
import {
  PROJECT_CATEGORY_FILTER_OPTIONS,
  type ProjectCategoryFilter,
} from '../../../../../_shared/projectCategory';

export interface ProjectsCategoryFilterProps {
  value: ProjectCategoryFilter;
  counts: Record<ProjectCategoryFilter, number>;
  onChange: (value: ProjectCategoryFilter) => void;
}

/** 作品集分类筛选：全部 / 个人项目 / 企业项目 */
export default function ProjectsCategoryFilter({
  value,
  counts,
  onChange,
}: ProjectsCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="项目类型筛选">
      {PROJECT_CATEGORY_FILTER_OPTIONS.map((option) => {
        const active = value === option.value;
        const count = counts[option.value];

        return (
          <AppButton
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            className={cn(
              'text-sm px-4 py-1.5 rounded-full border transition-colors',
              active
                ? 'border-accent text-accent bg-accent-soft'
                : 'border-line text-muted bg-surface hover:border-accent hover:text-accent',
            )}
            onClick={() => onChange(option.value)}
          >
            {option.label}
            <span className="ml-1.5 text-faint">({count})</span>
          </AppButton>
        );
      })}
    </div>
  );
}
