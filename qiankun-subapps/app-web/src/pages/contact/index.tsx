import { SubApp } from '../../../../_shared/components';
import ContactChannelsSection from './components/ContactChannelsSection';
import ContactFormSection from './components/ContactFormSection';
import ContactHeroSection from './components/ContactHeroSection';
import { useContactConfig } from './useContactConfig';
import { useContactForm } from './useContactForm';

/** 联系我 — 刊物式渠道卡片 + 留言表单 */
export default function ContactPage() {
  const { email, githubUrl, intro } = useContactConfig();
  const form = useContactForm();

  return (
    <SubApp className="contact">
      <ContactHeroSection intro={intro} />

      <div className="contact-body">
        <ContactChannelsSection email={email} githubUrl={githubUrl} />

        <ContactFormSection
          nickname={form.nickname}
          setNickname={form.setNickname}
          contact={form.contact}
          setContact={form.setContact}
          content={form.content}
          setContent={form.setContent}
          submitting={form.submitting}
          formError={form.formError}
          formSuccess={form.formSuccess}
          handleSubmit={form.handleSubmit}
        />
      </div>
    </SubApp>
  );
}
