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
    title: `诗词游戏PPT生成器`,
    description:
      '巨好玩的诗词九宫格游戏。将一句诗的每个字打散，需要连接起来还原诗句。适合语文课、班会课、学校诗词大会活动、公司年会等场景。',
    keywords: [
      '诗词游戏',
      '古诗游戏',
      '语文游戏PPT',
      '班会课游戏',
      '诗词大会PPT',
      '诗词大会游戏',
      '公司年会游戏',
      '公司年会游戏PPT',
      '诗词串串',
      '诗词串串PPT',
      '古诗九宫格',
      '诗词九宫格',
      '诗词连线',
      '古诗连线',
      '古诗连词',
      '诗词消消乐',
      '古诗消消乐',
    ],
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
