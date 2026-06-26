import { useEffect, useState } from 'react';
import { fetchSiteConfig } from '../../../../_shared/siteConfig';
import { useApiBase } from '../../context/ApiBaseContext';

/** 联系页展示信息默认值（与简历对齐） */
const DEFAULT_CONTACT = {
  email: '1355498705@qq.com',
  githubUrl: 'https://github.com/wangliuyong',
  intro:
    '有项目合作、技术交流或职业机会，欢迎联系。留言通常会在一个工作日内回复。',
};

/** 联系页顶部邮箱 / GitHub / 说明文案 */
export function useContactConfig() {
  const apiBase = useApiBase();
  const [email, setEmail] = useState(DEFAULT_CONTACT.email);
  const [githubUrl, setGithubUrl] = useState(DEFAULT_CONTACT.githubUrl);
  const [intro, setIntro] = useState(DEFAULT_CONTACT.intro);

  useEffect(() => {
    fetchSiteConfig(apiBase)
      .then((cfg) => {
        setEmail(cfg.email);
        setGithubUrl(cfg.githubUrl);
        if (cfg.contact?.intro) setIntro(cfg.contact.intro);
      })
      .catch(() => {});
  }, [apiBase]);

  return { email, githubUrl, intro };
}
