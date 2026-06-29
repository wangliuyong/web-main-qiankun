import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import 'prismjs/themes/prism-tomorrow.css';
import './globals.scss';

export const metadata: Metadata = {
  title: '王刘永的个人网站',
  description: 'Next.js + NestJS + Qiankun 微前端个人站',
  // app/favicon.ico 由 Next.js 自动挂载；此处显式声明便于 SEO 与部分爬虫识别
  icons: {
    icon: '/favicon.ico',
  },
};

/** 根布局：仅 html/body 与全局 Provider，不含站点导航 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
