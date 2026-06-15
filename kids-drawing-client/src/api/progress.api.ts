/**
 * 进度 API — 预留云同步
 */
import type { ProgressData } from '@/types/progress';
import { API_ENABLED, request } from '@/api/client';

/** 从服务端拉取进度（预留） */
export async function queryProgress(): Promise<ProgressData> {
  return request<ProgressData>('/progress', 'GET');
}

/** 同步进度到服务端（预留） */
export async function postProgress(data: ProgressData): Promise<void> {
  if (!API_ENABLED) return;
  await request<void>('/progress', 'POST', data as unknown as Record<string, unknown>);
}
