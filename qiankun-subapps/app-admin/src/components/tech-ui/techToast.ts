type ToastType = 'success' | 'error' | 'warning' | 'info';

const ICON: Record<ToastType, string> = {
  success: 'mdi:check-circle',
  error: 'mdi:close-circle',
  warning: 'mdi:alert',
  info: 'mdi:information',
};

/** 轻量 Toast（替代 antd message） */
export function techToast(message: string, type: ToastType = 'info') {
  const root = document.createElement('div');
  root.className = `tech-toast tech-toast--${type}`;
  root.innerHTML = `<span class="tech-toast__icon" data-icon="${ICON[type]}"></span><span>${message}</span>`;
  document.body.appendChild(root);
  requestAnimationFrame(() => root.classList.add('tech-toast--visible'));
  window.setTimeout(() => {
    root.classList.remove('tech-toast--visible');
    window.setTimeout(() => root.remove(), 300);
  }, 3200);
}

techToast.success = (msg: string) => techToast(msg, 'success');
techToast.error = (msg: string) => techToast(msg, 'error');
techToast.warning = (msg: string) => techToast(msg, 'warning');
techToast.info = (msg: string) => techToast(msg, 'info');
