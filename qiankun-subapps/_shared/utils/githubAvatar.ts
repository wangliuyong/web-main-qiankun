/**
 * 从 GitHub 主页 URL 解析用户名，生成头像地址。
 * 解析失败时返回 null，由调用方展示首字母占位。
 */
export function getGithubAvatarUrl(githubUrl?: string | null): string | null {
  if (!githubUrl) return null;

  try {
    const { pathname } = new URL(githubUrl);
    const username = pathname.split('/').filter(Boolean)[0];
    if (!username) return null;
    return `https://avatars.githubusercontent.com/${username}?s=80`;
  } catch {
    return null;
  }
}
