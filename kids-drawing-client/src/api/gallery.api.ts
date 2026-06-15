/**
 * 作品集 API — 预留云同步
 */
import type { GalleryData } from '@/types/gallery';
import { API_ENABLED, request } from '@/api/client';

/** 从服务端拉取作品集（预留） */
export async function queryGallery(): Promise<GalleryData> {
  return request<GalleryData>('/gallery', 'GET');
}

/** 同步作品集到服务端（预留） */
export async function postGallery(data: GalleryData): Promise<void> {
  if (!API_ENABLED) return;
  await request<void>('/gallery', 'POST', data as unknown as Record<string, unknown>);
}
