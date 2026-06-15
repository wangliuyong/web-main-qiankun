/**
 * 萌萌小动物图标与主题常量
 */

/** TabBar 导航 */
export const TAB_ITEMS = [
  { icon: '🐰', label: '学习', path: '/pages/home/index', animal: 'bunny' },
  { icon: '🐻', label: '画板', path: '/pages/studio/index', animal: 'bear' },
  { icon: '🦊', label: '作品', path: '/pages/gallery/index', animal: 'fox' },
  { icon: '🐼', label: '我的', path: '/pages/profile/index', animal: 'panda' },
] as const;

/** 首页快捷入口 */
export const QUICK_ACTIONS = [
  { icon: '🗺️', animal: '🦉', label: '课程地图', key: 'map' },
  { icon: '🖌️', animal: '🐻', label: '自由画板', key: 'studio' },
  { icon: '🖼️', animal: '🦊', label: '我的作品', key: 'gallery' },
  { icon: '🏆', animal: '🐼', label: '成长档案', key: 'profile' },
] as const;

/** 教程引导 - 形状对应小动物/物品 emoji */
export const GUIDE_SHAPE_EMOJI: Record<string, string> = {
  'line-h': '🐰',
  'line-v': '🐻',
  'line-wave': '🌊',
  'line-curve': '🦊',
  'line-free': '✏️',
  rect: '🐱',
  'rect-wide': '🐶',
  circle: '☀️',
  'circle-small': '🌸',
  triangle: '🔺',
  mountain: '⛰️',
  rainbow: '🌈',
  flower: '🌸',
  grass: '🌿',
  sun: '🐥',
  'sun-rays': '🌞',
  house: '🏠',
  cat: '🐱',
  star: '⭐',
  'star-small': '✨',
  sky: '🐦',
  free: '🎨',
  grid: '🐼',
};

/** 引导伙伴（按步骤轮换） */
export const GUIDE_BUDDIES = ['🐰', '🐻', '🦊', '🐱', '🐼', '🐥'] as const;

/** 章节默认小动物图标（无 emoji 时 fallback） */
export const CHAPTER_ANIMALS = ['🐰', '🐻', '🦊', '🐱', '🐼'] as const;
