/** API 统一响应结构 */
export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}
