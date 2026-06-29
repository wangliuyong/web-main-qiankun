import type { PrismaClient } from '@prisma/client';
import { APP_WEB_ANALYTICS_PATHS } from '../src/analytics/client-info.util';

/** 本周一 00:00:00（与 dashboard.service 一致） */
function startOfWeek(date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const weekday = d.getDay();
  const diff = weekday === 0 ? 6 : weekday - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

/** 各页面本周 mock 访问量权重（总和 100，便于演示占比） */
const MOCK_PAGE_VIEW_WEIGHTS: Array<{
  path: string;
  count: number;
  browser: string;
  os: string;
  device: string;
  region: string;
}> = [
  { path: '/about', count: 42, browser: 'Chrome', os: 'macOS', device: 'desktop', region: 'CN Shanghai' },
  { path: '/projects', count: 31, browser: 'Safari', os: 'iOS', device: 'mobile', region: 'CN Beijing' },
  { path: '/contact', count: 18, browser: 'Chrome', os: 'Windows', device: 'desktop', region: 'CN Guangdong' },
  { path: '/links', count: 9, browser: 'Firefox', os: 'Linux', device: 'desktop', region: 'CN Zhejiang' },
];

/**
 * 写入 app-web 本周访问 mock 数据（仅当本周尚无 SitePageView 时执行）。
 * 用于管理后台「本周热门页面」等统计演示。
 */
export async function seedPageViews(prisma: PrismaClient): Promise<number> {
  const weekStart = startOfWeek(new Date());
  const weekCount = await prisma.sitePageView.count({
    where: {
      path: { in: [...APP_WEB_ANALYTICS_PATHS] },
      createdAt: { gte: weekStart },
    },
  });

  if (weekCount > 0) {
    console.log(`Page views this week already exist (${weekCount}), skip page-views seed.`);
    return 0;
  }
  const rows: Array<{
    path: string;
    referrer: string | null;
    ip: string;
    browser: string;
    os: string;
    device: string;
    locale: string;
    timezone: string;
    region: string;
    createdAt: Date;
  }> = [];

  for (const item of MOCK_PAGE_VIEW_WEIGHTS) {
    if (!(APP_WEB_ANALYTICS_PATHS as readonly string[]).includes(item.path)) continue;

    for (let i = 0; i < item.count; i += 1) {
      const createdAt = new Date(weekStart);
      /** 分散到本周各天，模拟真实访问节奏 */
      createdAt.setDate(weekStart.getDate() + (i % 7));
      createdAt.setHours(8 + (i % 12), (i * 7) % 60, 0, 0);

      rows.push({
        path: item.path,
        referrer: i % 3 === 0 ? 'https://github.com' : null,
        ip: `203.0.113.${(i % 200) + 1}`,
        browser: item.browser,
        os: item.os,
        device: item.device,
        locale: 'zh-CN',
        timezone: 'Asia/Shanghai',
        region: item.region,
        createdAt,
      });
    }
  }

  await prisma.sitePageView.createMany({ data: rows });
  console.log(`Page views seeded: ${rows.length} records for this week.`);
  return rows.length;
}
