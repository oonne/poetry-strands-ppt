import 'server-only';
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './config';

import BasicMsgs from './modules/basic';
import LinkMsgs from './modules/link';

const loadedModules = {
  basic: BasicMsgs,
  link: LinkMsgs,
};

// 将短语言代码转换为完整的区域设置代码
const getFullLocale = (locale: string): LocaleType => {
  const localeMap: Record<string, LocaleType> = {
    en: 'en_US',
    'zh-CN': 'zh_CN',
    'zh-TW': 'zh_TW',
    es: 'es_ES',
    fr: 'fr_FR',
    ru: 'ru_RU',
    pt: 'pt_PT',
    de: 'de_DE',
    ja: 'ja_JP',
    it: 'it_IT',
    ko: 'ko_KR',
    vi: 'vi_VN',
  };

  return localeMap[locale] || 'en_US';
};

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;

  const locale = hasLocale(SUPPORTED_LANGUAGES, requested) ? requested : DEFAULT_LANGUAGE;
  const localeKey = getFullLocale(locale);
  const dictionary: Record<string, string> = {};

  // 合并所有模块的翻译
  Object.values(loadedModules).forEach(module => {
    Object.entries(module).forEach(([key, value]) => {
      dictionary[key] = value[localeKey];
    });
  });

  return {
    locale,
    messages: dictionary,
  };
});
