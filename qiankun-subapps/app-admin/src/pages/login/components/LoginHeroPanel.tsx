import LoginFeatureList from './LoginFeatureList';

/** 登录页左侧：Obsidian 品牌区 + 能力列表 */
export default function LoginHeroPanel() {
  return (
    <aside className="admin-login-hero" aria-label="站点管理后台介绍">
      <div className="admin-login-hero__accent" aria-hidden />
      <div className="admin-login-hero__content">
        <div className="admin-login-hero__brand">
          <span className="admin-login-hero__brand-mark" aria-hidden />
          <span>Obsidian Console</span>
        </div>
        <h1 className="admin-login-hero__title">站点管理后台</h1>
        <p className="admin-login-hero__lead">
          在这里维护个人站点的内容、项目与配置。登录后即可开始编辑。
        </p>
        <LoginFeatureList />
      </div>
    </aside>
  );
}
