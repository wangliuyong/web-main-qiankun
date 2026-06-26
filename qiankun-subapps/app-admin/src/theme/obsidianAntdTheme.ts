import type { ThemeConfig } from 'antd';
import { theme } from 'antd';
import { techAdminTokens as t } from './techAdminTokens';

/**
 * Ant Design 深色主题 — 对齐 Obsidian 控制台 Token
 * 供仍使用 antd 的表格、表单、Menu 等组件统一着色
 */
export const obsidianAntdTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: t.accentStrong,
    colorPrimaryHover: t.accent,
    colorPrimaryActive: '#5558e8',
    colorLink: t.accent,
    colorLinkHover: t.accent,
    colorBgLayout: t.bg,
    colorBgContainer: t.bgElevated,
    colorBgElevated: t.surface,
    colorText: t.text,
    colorTextSecondary: t.muted,
    colorTextTertiary: t.faint,
    colorBorder: t.border,
    colorBorderSecondary: t.border,
    colorSplit: t.border,
    colorFillAlter: t.surface,
    fontFamily: t.fontSans,
    borderRadius: t.radius,
    controlHeight: 34,
  },
  components: {
    Layout: {
      siderBg: '#0c0c0f',
      bodyBg: t.bg,
      headerBg: t.bgElevated,
      triggerBg: t.surface,
      triggerColor: t.muted,
    },
    Menu: {
      darkItemBg: 'transparent',
      darkSubMenuItemBg: 'transparent',
      darkItemSelectedBg: t.accentMuted,
      darkItemSelectedColor: t.accent,
      darkItemHoverBg: t.surfaceHover,
      darkItemColor: t.muted,
      itemHeight: 40,
      iconSize: 16,
    },
    Table: {
      headerBg: t.surface,
      headerColor: t.faint,
      rowHoverBg: 'rgba(99, 102, 241, 0.06)',
      borderColor: t.border,
      colorBgContainer: t.bgElevated,
    },
    Card: {
      colorBgContainer: t.bgElevated,
      colorBorderSecondary: t.border,
    },
    Modal: {
      contentBg: t.bgElevated,
      headerBg: t.bgElevated,
      titleColor: t.text,
    },
    Form: {
      labelColor: t.muted,
    },
    Input: {
      colorBgContainer: t.surface,
      activeBorderColor: t.accentBorder,
      hoverBorderColor: t.borderStrong,
    },
    Select: {
      colorBgContainer: t.surface,
      optionSelectedBg: t.accentMuted,
    },
    Button: {
      primaryShadow: 'none',
      defaultShadow: 'none',
    },
    Pagination: {
      itemBg: t.surface,
    },
    Result: {
      subtitleColor: t.muted,
    },
  },
};
