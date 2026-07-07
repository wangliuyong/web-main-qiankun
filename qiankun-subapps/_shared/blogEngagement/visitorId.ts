const VISITOR_ID_KEY = 'wly_blog_visitor_id';

/**
 * 获取或创建匿名访客标识。
 * 点赞 / 收藏依赖此 ID 去重，存于 localStorage，无需登录。
 */
export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    if (existing) {
      return existing;
    }

    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `v-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    localStorage.setItem(VISITOR_ID_KEY, id);
    return id;
  } catch {
    return `v-${Date.now()}`;
  }
}
