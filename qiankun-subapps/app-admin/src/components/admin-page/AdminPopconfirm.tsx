import { Popconfirm, type PopconfirmProps } from 'antd';

/** 表格操作列等场景：挂载到 body，避免被 fixed 列 stacking context 遮挡 */
const ADMIN_POPCONFIRM_Z_INDEX = 1100;

/**
 * 后台二次确认（基于 antd Popconfirm）
 * 统一 popup 容器与 z-index，解决 fixed 操作列内 Popconfirm 被遮挡问题
 */
export default function AdminPopconfirm(props: PopconfirmProps) {
  return (
    <Popconfirm
      {...props}
      zIndex={ADMIN_POPCONFIRM_Z_INDEX}
      getPopupContainer={() => document.body}
    />
  );
}
