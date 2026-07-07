/**
 * 站点内容实体类型（与 NestJS 实体 / DTO 对齐）
 * 前后台子应用共用，避免 admin / web 各自维护一份字段定义
 */

/** 博客文章 */
export interface Article {
  id: number;
  title: string;
  summary: string | null;
  content: string;
  category: string | null;
  tags: string | null;
  slug: string | null;
  publishedAt: string;
}

/** 博客文章分页结果（/api/article/list?page=1） */
export interface ArticlePageResult {
  list: Article[];
  total: number;
  page: number;
  pageSize: number;
}

/** 项目展示 */
export interface Project {
  id: number;
  name: string;
  desc: string;
  techStack: string | null;
  githubUrl: string | null;
  previewUrl: string | null;
  /** personal 个人项目 | enterprise 企业项目 */
  category: string | null;
}

/** 友情链接 */
export interface LinkItem {
  id: number;
  name: string;
  url: string;
  description: string | null;
  avatar: string | null;
  sort: number;
}

/** 访客留言 */
export interface Message {
  id: number;
  nickname: string;
  contact: string | null;
  content: string;
  createdAt: string;
}
