import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import TechButton from './TechButton';

export interface TechModalProps {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
  onClose: () => void;
  onOk?: () => void;
  okText?: string;
  okDisabled?: boolean;
  confirmLoading?: boolean;
}

/** 模态对话框 */
export default function TechModal({
  open,
  title,
  children,
  footer,
  width = 560,
  onClose,
  onOk,
  okText = '确定',
  okDisabled,
  confirmLoading,
}: TechModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const defaultFooter = (
    <>
      <TechButton onClick={onClose} disabled={confirmLoading}>取消</TechButton>
      {onOk ? (
        <TechButton variant="primary" loading={confirmLoading} disabled={okDisabled} onClick={onOk}>
          {okText}
        </TechButton>
      ) : null}
    </>
  );

  return createPortal(
    <div className="tech-modal-root" role="presentation" onClick={onClose}>
      <div
        className="tech-modal"
        style={{ width: `min(${width}px, calc(100vw - 32px))` }}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="tech-modal__head">
          <h2 className="tech-modal__title">{title}</h2>
          <button type="button" className="tech-modal__close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </header>
        <div className="tech-modal__body">{children}</div>
        <footer className="tech-modal__foot">{footer ?? defaultFooter}</footer>
      </div>
    </div>,
    document.body,
  );
}
