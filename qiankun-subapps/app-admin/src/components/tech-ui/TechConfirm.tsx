import { useState, type ReactNode } from 'react';
import TechButton from './TechButton';

export interface TechConfirmProps {
  title: string;
  onConfirm: () => void;
  children: ReactNode;
  okText?: string;
  cancelText?: string;
}

/** 确认操作包装器 */
export default function TechConfirm({
  title,
  onConfirm,
  children,
  okText = '确认',
  cancelText = '取消',
}: TechConfirmProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className="tech-confirm">
      <span onClick={() => setOpen(true)}>{children}</span>
      {open ? (
        <div className="tech-confirm__popover" role="dialog">
          <p className="tech-confirm__title">{title}</p>
          <div className="tech-confirm__actions">
            <TechButton variant="ghost" onClick={() => setOpen(false)}>{cancelText}</TechButton>
            <TechButton
              variant="primary"
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
              {okText}
            </TechButton>
          </div>
        </div>
      ) : null}
    </span>
  );
}
