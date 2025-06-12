import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { Geist, Geist_Mono } from 'next/font/google';
import { DEFAULT_LANGUAGE } from '@/i18n/config';
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
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  let canonical = process.env.NEXT_PUBLIC_DOMAIN;
  if (locale !== DEFAULT_LANGUAGE) {
    canonical = `${process.env.NEXT_PUBLIC_DOMAIN}/${locale}`;
  }

  return {
    title: `Next Demo`,
    description: 'Next 示例项目 description',
    keywords: ['Next'],
    alternates: {
      canonical,
    },
  };
}

/*
 * 运行时 必须设置为edge，以支持国际化和服务端渲染
 */
export const runtime = 'edge';

/*
 * 基础布局
 */
const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
