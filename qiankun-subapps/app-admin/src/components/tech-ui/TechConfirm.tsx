import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import TechButton from './TechButton';

/** 确认弹层 z-index，需高于表格 fixed 列与顶栏 */
const TECH_CONFIRM_Z_INDEX = 1100;

export interface TechConfirmProps {
  title: string;
  onConfirm: () => void;
  children: ReactNode;
  okText?: string;
  cancelText?: string;
}

interface PopoverPosition {
  top: number;
  left: number;
}

/** 根据触发按钮位置计算弹层坐标（右对齐，优先向下展开） */
function calcPopoverPosition(trigger: HTMLElement): PopoverPosition {
  const rect = trigger.getBoundingClientRect();
  const popoverHeight = 96;
  const gap = 6;
  const viewportPadding = 8;

  const fitsBelow = rect.bottom + gap + popoverHeight <= window.innerHeight - viewportPadding;
  const top = fitsBelow
    ? rect.bottom + gap
    : Math.max(viewportPadding, rect.top - gap - popoverHeight);

  return {
    top,
    left: Math.min(rect.right, window.innerWidth - viewportPadding),
  };
}

/**
 * 确认操作包装器
 * 弹层通过 Portal 挂载到 body，避免在 fixed 操作列中被相邻行/滚动区域遮挡
 */
export default function TechConfirm({
  title,
  onConfirm,
  children,
  okText = '确认',
  cancelText = '取消',
}: TechConfirmProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<PopoverPosition>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);

  const close = useCallback(() => setOpen(false), []);

  const openConfirm = useCallback(() => {
    if (!triggerRef.current) return;
    setPosition(calcPopoverPosition(triggerRef.current));
    setOpen(true);
  }, []);

  /** 滚动/缩放时跟随触发按钮 reposition */
  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      if (!triggerRef.current) return;
      setPosition(calcPopoverPosition(triggerRef.current));
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open]);

  /** Esc 关闭 */
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  const popover =
    open && typeof document !== 'undefined'
      ? createPortal(
          <>
            <div
              className="tech-confirm__backdrop"
              style={{ zIndex: TECH_CONFIRM_Z_INDEX - 1 }}
              onClick={close}
              aria-hidden
            />
            <div
              className="tech-confirm__popover tech-confirm__popover--portal"
              role="dialog"
              style={{
                top: position.top,
                left: position.left,
                zIndex: TECH_CONFIRM_Z_INDEX,
              }}
            >
              <p className="tech-confirm__title">{title}</p>
              <div className="tech-confirm__actions">
                <TechButton variant="ghost" onClick={close}>
                  {cancelText}
                </TechButton>
                <TechButton
                  variant="primary"
                  onClick={() => {
                    onConfirm();
                    close();
                  }}
                >
                  {okText}
                </TechButton>
              </div>
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <>
      <span ref={triggerRef} className="tech-confirm" onClick={openConfirm}>
        {children}
      </span>
      {popover}
    </>
  );
}
