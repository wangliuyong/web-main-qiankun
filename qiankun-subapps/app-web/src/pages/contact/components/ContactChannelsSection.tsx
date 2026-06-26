import { CONTACT_WECHAT } from '../../../../../_shared/data/contact';
import { RESUME_PDF_FILENAME, RESUME_PDF_HREF } from '../../../../../_shared/data/resume';

/** 从 GitHub URL 提取展示用用户名 */
function githubDisplayName(url: string): string {
  try {
    const path = new URL(url).pathname.replace(/^\/+|\/+$/g, '');
    return path || '查看主页';
  } catch {
    return '查看主页';
  }
}

export interface ContactChannelItem {
  key: string;
  label: string;
  value: string;
  href: string;
  external?: boolean;
  download?: string;
}

export interface ContactChannelsSectionProps {
  email: string;
  githubUrl: string;
}

/** 联系页：邮箱 / GitHub / 微信 / 简历下载渠道卡片 */
export default function ContactChannelsSection({
  email,
  githubUrl,
}: ContactChannelsSectionProps) {
  const channels: ContactChannelItem[] = [
    {
      key: 'email',
      label: '邮箱',
      value: email,
      href: `mailto:${email}`,
    },
    {
      key: 'github',
      label: 'GitHub',
      value: githubDisplayName(githubUrl),
      href: githubUrl,
      external: true,
    },
    {
      key: 'wechat',
      label: '微信',
      value: CONTACT_WECHAT,
      href: `tel:${CONTACT_WECHAT}`,
    },
    {
      key: 'resume',
      label: '简历',
      value: 'PDF 下载',
      href: RESUME_PDF_HREF,
      download: RESUME_PDF_FILENAME,
    },
  ];

  return (
    <div className="contact-channels-wrap">
      <h2 className="contact-channels-title">直接联系</h2>
      <ul className="contact-channels" aria-label="联系方式">
        {channels.map((item) => (
          <li className="contact-channel" key={item.key}>
            <a
              className="contact-channel-card"
              href={item.href}
              {...(item.download ? { download: item.download } : {})}
              {...(item.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              aria-label={
                item.key === 'wechat'
                  ? `微信 ${item.value}`
                  : `${item.label}：${item.value}`
              }
            >
              <span className="contact-channel-kicker">{item.label}</span>
              <span className="contact-channel-value">{item.value}</span>
              <span className="contact-channel-action" aria-hidden="true">
                {item.key === 'resume' ? '↓' : '→'}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
