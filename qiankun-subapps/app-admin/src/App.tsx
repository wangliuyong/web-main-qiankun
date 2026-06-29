import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { SubApp } from '../../_shared/components/Layout';
import { obsidianAntdTheme } from './theme/obsidianAntdTheme';
import AdminErrorBoundary from './components/_common/AdminErrorBoundary';
import { ApiBaseProvider } from './context/ApiBaseContext';
import { AuthProvider } from './context/AuthContext';
import AdminRouter from './router';

interface AppProps {
  apiBase: string;
}

/** 管理后台根组件：全局 Provider + 路由 */
export default function App({ apiBase }: AppProps) {
  return (
    <ConfigProvider locale={zhCN} theme={obsidianAntdTheme}>
      <SubApp style={{ height: '100%', minHeight: '100%' }}>
        <AdminErrorBoundary>
          <ApiBaseProvider apiBase={apiBase}>
            <AuthProvider>
              <AdminRouter />
            </AuthProvider>
          </ApiBaseProvider>
        </AdminErrorBoundary>
      </SubApp>
    </ConfigProvider>
  );
}
