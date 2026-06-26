/** 登录页左侧能力说明项 */
export interface LoginFeatureItem {
  /** Iconify 图标名 */
  icon: string;
  title: string;
  description: string;
}

/** 与后台实际模块对齐的展示文案 */
export const LOGIN_FEATURES: LoginFeatureItem[] = [
  {
    icon: 'mdi:file-document-outline',
    title: '内容与文章',
    description: '维护站点文案、博客文章与页面说明。',
  },
  {
    icon: 'mdi:briefcase-outline',
    title: '项目与友链',
    description: '更新作品集、友链与导航配置。',
  },
  {
    icon: 'mdi:shield-check-outline',
    title: '权限与日志',
    description: '管理账号权限，查看操作与审计记录。',
  },
];
