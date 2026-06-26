import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDefaultMenuPath } from '../../router/menuUtils';
import { TechButton, TechIcon } from '../../components/tech-ui';

/** 403 无权限页 */
export default function ForbiddenPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const home = profile ? `/${getDefaultMenuPath(profile.menus)}` : '/dashboard';

  return (
    <div className="admin-forbidden">
      <div className="admin-forbidden__icon" aria-hidden>
        <TechIcon icon="mdi:shield-lock-outline" size={48} />
      </div>
      <h1 className="admin-forbidden__title">403</h1>
      <p className="admin-forbidden__desc">抱歉，您没有权限访问此页面</p>
      <TechButton variant="primary" onClick={() => navigate(home, { replace: true })}>
        返回首页
      </TechButton>
    </div>
  );
}
