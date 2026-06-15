/**
 * HTTP 客户端 — 预留 nest-server 对接
 */
import type { ApiResponse } from '@/types/api-response';

/** API 基础地址（后续从环境配置读取） */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api/kids-drawing';

/** 是否启用远程 API（首期 false，使用本地存储） */
export const API_ENABLED = false;

/**
 * 通用请求封装（预留）
 */
export function request<T>(
  url: string,
  method: UniNamespace.RequestOptions['method'],
  data?: Record<string, unknown>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!API_ENABLED) {
      reject(new Error('API 未启用，请使用本地存储'));
      return;
    }
    uni.request({
      url: API_BASE_URL + url,
      method,
      data,
      success: (res) => {
        const body = res.data as ApiResponse<T>;
        if (body.code === 0) {
          resolve(body.data);
        } else {
          reject(new Error(body.message));
        }
      },
      fail: reject,
    });
  });
}
