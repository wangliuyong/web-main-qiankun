import { CONTACT_DEFAULT_INTRO } from '../../../../../_shared/data/contact';

export interface ContactHeroSectionProps {
  /** 后台配置的页面说明，缺省时展示默认引导语 */
  intro?: string;
}

/** 联系页顶部：标题、引导语与回复预期 */
export default function ContactHeroSection({ intro }: ContactHeroSectionProps) {
  return (
    <header className="contact-hero">
      <h1 className="contact-title">联系我</h1>
      <p className="contact-lead">{intro?.trim() || CONTACT_DEFAULT_INTRO}</p>
      <p className="contact-note">合肥 · 可远程协作</p>
    </header>
  );
}
