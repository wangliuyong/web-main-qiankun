import { TechButton, TechCard, TechIcon } from '../../../components/tech-ui';

interface DashboardQuickLinksProps {
  onNavigate: (path: string) => void;
}

/** 常用管理入口快捷跳转 */
export default function DashboardQuickLinks({ onNavigate }: DashboardQuickLinksProps) {
  const links = [
    { path: 'articles', label: '博客管理', icon: 'mdi:file-document-outline' },
    { path: 'messages', label: '留言管理', icon: 'mdi:comment-text-outline' },
    { path: 'system/site-config', label: '站点配置', icon: 'mdi:cog-outline' },
    { path: 'logs/app', label: '错误日志', icon: 'mdi:bug-outline' },
  ];

  return (
    <TechCard title="快捷入口">
      <div className="dashboard-quick-links">
        {links.map((link) => (
          <TechButton
            key={link.path}
            icon={link.icon}
            onClick={() => onNavigate(link.path)}
          >
            {link.label}
          </TechButton>
        ))}
      </div>
    </TechCard>
  );
}
