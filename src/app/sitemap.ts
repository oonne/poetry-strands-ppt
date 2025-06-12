import type { MetadataRoute } from 'next';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/i18n/config';

/*
 * 生成 sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || '';
  const urls: MetadataRoute.Sitemap = [];

  // 为每种语言生成 URL
  SUPPORTED_LANGUAGES.forEach(lang => {
    // 处理首页
    if (lang === DEFAULT_LANGUAGE) {
      urls.push({
        url: domain,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
        alternates: {
          languages: {
            ...Object.fromEntries(
              SUPPORTED_LANGUAGES.map(l => [l, l === DEFAULT_LANGUAGE ? domain : `${domain}/${l}`]),
            ),
          },
        },
      });
    } else {
      urls.push({
        url: `${domain}/${lang}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
        alternates: {
          languages: {
            ...Object.fromEntries(
              SUPPORTED_LANGUAGES.map(l => [l, l === DEFAULT_LANGUAGE ? domain : `${domain}/${l}`]),
            ),
          },
        },
      });
    }

    // 处理其他页面

    urls.push({
      url: `${domain}/${lang}/page-1`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          ...Object.fromEntries(SUPPORTED_LANGUAGES.map(l => [l, `${domain}/${l}/page-1`])),
        },
      },
    });
  });

  return urls;
}
