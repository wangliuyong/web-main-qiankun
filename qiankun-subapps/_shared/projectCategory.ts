/**
 * 项目分类：个人项目 vs 企业项目
 * 与 NestJS Project.category 字段取值一致，前后台共用
 */
export const PROJECT_CATEGORY = {
  /** 个人独立开发或副业项目 */
  personal: 'personal',
  /** 企业 / 团队在职期间负责的项目 */
  enterprise: 'enterprise',
} as const;

export type ProjectCategory = (typeof PROJECT_CATEGORY)[keyof typeof PROJECT_CATEGORY];

/** 分类展示文案 */
export const PROJECT_CATEGORY_LABEL: Record<ProjectCategory, string> = {
  [PROJECT_CATEGORY.personal]: '个人项目',
  [PROJECT_CATEGORY.enterprise]: '企业项目',
};

/** 筛选项：全部 + 各分类 */
export const PROJECT_CATEGORY_FILTER_OPTIONS = [
  { value: 'all' as const, label: '全部' },
  { value: PROJECT_CATEGORY.personal, label: PROJECT_CATEGORY_LABEL.personal },
  { value: PROJECT_CATEGORY.enterprise, label: PROJECT_CATEGORY_LABEL.enterprise },
];

export type ProjectCategoryFilter = (typeof PROJECT_CATEGORY_FILTER_OPTIONS)[number]['value'];

/** 判断是否为合法分类值 */
export function isProjectCategory(value: string | null | undefined): value is ProjectCategory {
  return value === PROJECT_CATEGORY.personal || value === PROJECT_CATEGORY.enterprise;
}

/** 获取分类展示文案，未知值返回 null */
export function getProjectCategoryLabel(value: string | null | undefined): string | null {
  if (!isProjectCategory(value)) return null;
  return PROJECT_CATEGORY_LABEL[value];
}
