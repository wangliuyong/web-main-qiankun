export interface TechTabItem {
  key: string;
  label: string;
}

export interface TechTabsProps {
  activeKey: string;
  items: TechTabItem[];
  onChange: (key: string) => void;
  className?: string;
}

/** 标签页切换 */
export default function TechTabs({ activeKey, items, onChange, className }: TechTabsProps) {
  return (
    <div className={['tech-tabs', className].filter(Boolean).join(' ')} role="tablist">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          role="tab"
          aria-selected={activeKey === item.key}
          className={['tech-tabs__item', activeKey === item.key && 'tech-tabs__item--active']
            .filter(Boolean)
            .join(' ')}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
