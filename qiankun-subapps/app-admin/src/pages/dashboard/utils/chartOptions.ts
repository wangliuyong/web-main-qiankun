import type { DashboardOverview } from '../types';

/** Obsidian 控制台图表色板（靛蓝 + 语义色） */
export const DASHBOARD_CHART_COLORS = {
  accent: '#818cf8',
  accentStrong: '#6366f1',
  ink: '#fafafa',
  sand: '#71717a',
  muted: '#a1a1aa',
  message: '#4ade80',
  ai: '#a78bfa',
  grid: 'rgba(63, 63, 70, 0.45)',
  tooltipBg: '#111113',
  tooltipBorder: 'rgba(99, 102, 241, 0.35)',
  pieBorder: '#111113',
} as const;

/** 访问与互动趋势折线图 */
export function buildVisitTrendOption(
  dailyTrend: DashboardOverview['charts']['dailyTrend'],
) {
  const labels = dailyTrend.map((item) => item.label);

  return {
    color: [
      DASHBOARD_CHART_COLORS.accent,
      DASHBOARD_CHART_COLORS.message,
      DASHBOARD_CHART_COLORS.ai,
    ],
    tooltip: {
      trigger: 'axis',
      backgroundColor: DASHBOARD_CHART_COLORS.tooltipBg,
      borderColor: DASHBOARD_CHART_COLORS.tooltipBorder,
      textStyle: { color: DASHBOARD_CHART_COLORS.ink, fontSize: 12 },
    },
    legend: {
      data: ['页面访问', '新增留言', 'AI 会话'],
      bottom: 0,
      textStyle: { color: DASHBOARD_CHART_COLORS.muted, fontSize: 12 },
    },
    grid: { left: 12, right: 16, top: 24, bottom: 48, containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
      axisLine: { lineStyle: { color: DASHBOARD_CHART_COLORS.grid } },
      axisLabel: { color: DASHBOARD_CHART_COLORS.muted, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: DASHBOARD_CHART_COLORS.grid } },
      axisLabel: { color: DASHBOARD_CHART_COLORS.muted, fontSize: 11 },
    },
    series: [
      {
        name: '页面访问',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2.5 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(99, 102, 241, 0.22)' },
              { offset: 1, color: 'rgba(99, 102, 241, 0.02)' },
            ],
          },
        },
        data: dailyTrend.map((item) => item.pageViews),
      },
      {
        name: '新增留言',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        data: dailyTrend.map((item) => item.messages),
      },
      {
        name: 'AI 会话',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        data: dailyTrend.map((item) => item.aiSessions),
      },
    ],
  };
}

/** 热门页面横向柱状图 */
export function buildTopPagesOption(topPages: DashboardOverview['charts']['topPages']) {
  const paths = [...topPages].reverse().map((item) => item.path);
  const values = [...topPages].reverse().map((item) => item.views);

  return {
    color: [DASHBOARD_CHART_COLORS.accentStrong],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: DASHBOARD_CHART_COLORS.tooltipBg,
      borderColor: DASHBOARD_CHART_COLORS.tooltipBorder,
      textStyle: { color: DASHBOARD_CHART_COLORS.ink, fontSize: 12 },
    },
    grid: { left: 8, right: 24, top: 8, bottom: 8, containLabel: true },
    xAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: { lineStyle: { color: DASHBOARD_CHART_COLORS.grid } },
      axisLabel: { color: DASHBOARD_CHART_COLORS.muted, fontSize: 11 },
    },
    yAxis: {
      type: 'category',
      data: paths,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: DASHBOARD_CHART_COLORS.ink,
        fontSize: 11,
        width: 120,
        overflow: 'truncate',
      },
    },
    series: [
      {
        type: 'bar',
        barWidth: 14,
        itemStyle: { borderRadius: [0, 2, 2, 0] },
        data: values,
      },
    ],
  };
}

/** 站点内容构成环形图 */
export function buildContentMixOption(contentMix: DashboardOverview['charts']['contentMix']) {
  const data = [
    { name: '博客', value: contentMix.articles },
    { name: '项目', value: contentMix.projects },
    { name: '友链', value: contentMix.links },
  ].filter((item) => item.value > 0);

  return {
    color: ['#6366f1', '#4ade80', '#a78bfa'],
    tooltip: {
      trigger: 'item',
      backgroundColor: DASHBOARD_CHART_COLORS.tooltipBg,
      borderColor: DASHBOARD_CHART_COLORS.tooltipBorder,
      textStyle: { color: DASHBOARD_CHART_COLORS.ink, fontSize: 12 },
    },
    legend: {
      bottom: 0,
      textStyle: { color: DASHBOARD_CHART_COLORS.muted, fontSize: 12 },
    },
    series: [
      {
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '44%'],
        itemStyle: {
          borderColor: DASHBOARD_CHART_COLORS.pieBorder,
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        data,
      },
    ],
  };
}
