import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import '@/style/globals.css';

/*
 * 字体
 */
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/*
 * SEO TDK
 */
export function generateMetadata(): Metadata {
  return {
    title: `Next Demo`,
    description: 'Next 示例项目 description',
    keywords: ['Next'],
    alternates: {
      canonical: process.env.NEXT_PUBLIC_DOMAIN,
    },
  };
}

/*
 * 基础布局
 */
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
};

export default RootLayout;
