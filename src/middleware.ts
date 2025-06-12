import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/i18n/config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 检查路径是否已经包含语言前缀，如果包含，不需要重定向
  const pathnameHasLocale = SUPPORTED_LANGUAGES.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    // 从路径中提取语言代码
    const locale = pathname.split('/')[1];

    // 如果访问的是 /${DEFAULT_LANGUAGE}，重定向到首页
    if (pathname === `/${DEFAULT_LANGUAGE}`) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    // response 设置 X-NEXT-INTL-LOCALE 头部 为 locale
    const response = NextResponse.next();
    response.headers.set('X-NEXT-INTL-LOCALE', locale);
    return response;
  }

  // 如果路径没有包含语言前缀，则默认为英文
  const url = request.nextUrl.clone();

  // 首页保留原路径
  if (pathname === '/') {
    url.pathname = `/${DEFAULT_LANGUAGE}`;
    const response = NextResponse.rewrite(url);
    response.headers.set('X-NEXT-INTL-LOCALE', DEFAULT_LANGUAGE);
    return response;
  }

  // 子页面重定向
  url.pathname = `/${DEFAULT_LANGUAGE}${pathname}`;
  const response = NextResponse.redirect(url);
  // 关键部分：手动设置 X-NEXT-INTL-LOCALE 头部
  response.headers.set('X-NEXT-INTL-LOCALE', DEFAULT_LANGUAGE);
  return response;
}

export const config = {
  matcher: [
    // 匹配所有路径，包括不存在的页面
    '/((?!_next|api|_vercel|.*\\..*).*)',
  ],
};
