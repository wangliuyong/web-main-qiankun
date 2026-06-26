import TechPageShell from '../tech-ui/TechPageShell';
import type { AdminPageShellProps } from './types';

/**
 * 后台页面统一外壳 — 委托 Obsidian TechPageShell
 */
export default function AdminPageShell({
  title,
  description,
  extra,
  stats,
  children,
  className,
}: AdminPageShellProps) {
  const techStats = stats?.map((item) => ({
    label: item.label,
    value: item.value,
    hint: item.hint,
    icon: item.icon,
    accent: item.accent === 'primary' || item.accent === 'warning',
  }));

  return (
    <TechPageShell
      title={title}
      description={description}
      extra={extra}
      stats={techStats}
      className={['admin-page', className].filter(Boolean).join(' ')}
    >
      <div className="admin-page__body">{children}</div>
    </TechPageShell>
  );
}
