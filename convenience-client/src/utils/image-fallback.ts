/**
 * 图片加载失败时的艺术色板工具
 * 与 tokens.scss 钴蓝编辑感一致：按 seed 稳定映射渐变与几何变体，避免灰底图标占位
 */

/** 单套艺术色板定义 */
export interface ArtFallbackPalette {
  /** 主背景渐变（可直接用于 background） */
  background: string;
  /** 装饰色块 A，用于 CSS 变量 --art-accent-a */
  accentA: string;
  /** 装饰色块 B，用于 CSS 变量 --art-accent-b */
  accentB: string;
  /** 几何构图变体 0 | 1 | 2 */
  variant: 0 | 1 | 2;
}

/** 渐变色停与角度配置 */
interface PaletteDef {
  stops: [string, string, string];
  angle: number;
  accentA: string;
  accentB: string;
}

/**
 * 策展色板：墨蓝、钴蓝、青绿、靛紫、琥珀（品牌强调色）
 * 不使用暖米色/黄铜系，保持与同城便民视觉语言一致
 */
const ART_PALETTE_DEFS: PaletteDef[] = [
  { stops: ['#0b1220', '#1e3a8a', '#1d4ed8'], angle: 152, accentA: 'rgba(191, 219, 254, 0.32)', accentB: 'rgba(255, 255, 255, 0.1)' },
  { stops: ['#1e293b', '#334155', '#64748b'], angle: 138, accentA: 'rgba(148, 163, 184, 0.28)', accentB: 'rgba(255, 255, 255, 0.08)' },
  { stops: ['#134e4a', '#0f766e', '#14b8a6'], angle: 165, accentA: 'rgba(153, 246, 228, 0.26)', accentB: 'rgba(255, 255, 255, 0.09)' },
  { stops: ['#312e81', '#4338ca', '#6366f1'], angle: 145, accentA: 'rgba(199, 210, 254, 0.3)', accentB: 'rgba(255, 255, 255, 0.11)' },
  { stops: ['#7c2d12', '#c2410c', '#ea580c'], angle: 158, accentA: 'rgba(254, 215, 170, 0.28)', accentB: 'rgba(255, 255, 255, 0.1)' },
  { stops: ['#0c1445', '#1d4ed8', '#3b82f6'], angle: 172, accentA: 'rgba(147, 197, 253, 0.3)', accentB: 'rgba(255, 255, 255, 0.12)' },
  { stops: ['#164e63', '#0891b2', '#22d3ee'], angle: 140, accentA: 'rgba(165, 243, 252, 0.25)', accentB: 'rgba(255, 255, 255, 0.09)' },
  { stops: ['#1e1b4b', '#3730a3', '#818cf8'], angle: 160, accentA: 'rgba(224, 231, 255, 0.28)', accentB: 'rgba(255, 255, 255, 0.1)' },
];

/**
 * 将 seed 转为无符号整数哈希，保证同一业务 id 始终映射到同一色板
 */
export function hashImageSeed(seed: string | number): number {
  const str = String(seed);
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * 根据 seed 解析艺术色板与构图变体
 * @param seed 业务主键，如 item.id、banner.id、或 `${id}-${imgIndex}`
 */
export function resolveArtFallbackPalette(seed: string | number): ArtFallbackPalette {
  const hash = hashImageSeed(seed);
  const def = ART_PALETTE_DEFS[hash % ART_PALETTE_DEFS.length];
  const variant = (hash % 3) as 0 | 1 | 2;

  return {
    background: `linear-gradient(${def.angle}deg, ${def.stops[0]} 0%, ${def.stops[1]} 48%, ${def.stops[2]} 100%)`,
    accentA: def.accentA,
    accentB: def.accentB,
    variant,
  };
}
