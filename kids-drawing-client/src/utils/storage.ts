/**
 * 本地存储读写封装
 */
import type { ProgressData, ProfileData } from '@/types/progress';
import type { GalleryData } from '@/types/gallery';

const KEY_PROGRESS = 'kids_progress';
const KEY_GALLERY = 'kids_gallery';
const KEY_PROFILE = 'kids_profile';

/** 默认进度数据 */
export function createDefaultProgress(): ProgressData {
  return {
    lessonRecords: [],
    totalStars: 0,
    streakDays: 0,
    lastStudyDate: '',
    unlockedBadges: [],
  };
}

/** 默认档案数据 */
export function createDefaultProfile(): ProfileData {
  return {
    nickname: '小画家',
    avatarEmoji: '🎨',
  };
}

/** 默认作品集数据 */
export function createDefaultGallery(): GalleryData {
  return { works: [] };
}

/** 读取进度 */
export function loadProgress(): ProgressData {
  const raw = uni.getStorageSync(KEY_PROGRESS);
  if (!raw) return createDefaultProgress();
  try {
    return JSON.parse(raw as string) as ProgressData;
  } catch {
    return createDefaultProgress();
  }
}

/** 保存进度 */
export function saveProgress(data: ProgressData): void {
  uni.setStorageSync(KEY_PROGRESS, JSON.stringify(data));
}

/** 读取作品集 */
export function loadGallery(): GalleryData {
  const raw = uni.getStorageSync(KEY_GALLERY);
  if (!raw) return createDefaultGallery();
  try {
    return JSON.parse(raw as string) as GalleryData;
  } catch {
    return createDefaultGallery();
  }
}

/** 保存作品集 */
export function saveGallery(data: GalleryData): void {
  uni.setStorageSync(KEY_GALLERY, JSON.stringify(data));
}

/** 读取档案 */
export function loadProfile(): ProfileData {
  const raw = uni.getStorageSync(KEY_PROFILE);
  if (!raw) return createDefaultProfile();
  try {
    return JSON.parse(raw as string) as ProfileData;
  } catch {
    return createDefaultProfile();
  }
}

/** 保存档案 */
export function saveProfile(data: ProfileData): void {
  uni.setStorageSync(KEY_PROFILE, JSON.stringify(data));
}

/** 获取今日日期字符串 YYYY-MM-DD */
export function getTodayDateStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 生成唯一 id */
export function generateId(): string {
  return `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}
