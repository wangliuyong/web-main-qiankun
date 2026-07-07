/** 格式化互动计数：大数缩写（列表与详情共用） */
export function formatEngagementCount(count: number): string {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}万`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}
