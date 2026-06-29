import { Component, type ErrorInfo, type ReactNode } from 'react';

interface AdminErrorBoundaryProps {
  children: ReactNode;
}

interface AdminErrorBoundaryState {
  error: Error | null;
}

/**
 * 管理后台根级错误边界：捕获路由/渲染异常，避免 Qiankun 子应用整页空白且无提示。
 */
export default class AdminErrorBoundary extends Component<
  AdminErrorBoundaryProps,
  AdminErrorBoundaryState
> {
  state: AdminErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AdminErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[app-admin] 渲染异常', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div className="admin-forbidden" role="alert">
          <div className="admin-forbidden__icon" aria-hidden>
            !
          </div>
          <h1 className="admin-forbidden__title">页面加载失败</h1>
          <p className="admin-forbidden__desc">{error.message || '未知错误'}</p>
          <button
            type="button"
            className="admin-shell-header__link"
            onClick={() => window.location.reload()}
          >
            重新加载
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
