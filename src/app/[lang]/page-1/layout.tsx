import { getLocale } from 'next-intl/server';
import type { Metadata } from 'next';

/*
 * SEO TDK
 */
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  return {
    title: 'Next Demo Page-1',
    description: '页面1 description',
    keywords: ['页面1'],
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/${locale}/page-1`,
    },
  };
}

export default function Page1Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
