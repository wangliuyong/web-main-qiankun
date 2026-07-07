import type { ArticleComment } from '../contentTypes';

/** 带嵌套子回复的评论节点 */
export interface ArticleCommentNode extends ArticleComment {
  children: ArticleCommentNode[];
}

/**
 * 将扁平评论列表组装为树形结构（按 parentId 挂载子回复）。
 * 孤儿节点（父评论缺失）降级为顶级展示。
 */
export function buildCommentTree(comments: ArticleComment[]): ArticleCommentNode[] {
  const nodeMap = new Map<number, ArticleCommentNode>();

  for (const comment of comments) {
    nodeMap.set(comment.id, { ...comment, children: [] });
  }

  const roots: ArticleCommentNode[] = [];

  for (const comment of comments) {
    const node = nodeMap.get(comment.id);
    if (!node) continue;

    if (comment.parentId != null) {
      const parent = nodeMap.get(comment.parentId);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
}
