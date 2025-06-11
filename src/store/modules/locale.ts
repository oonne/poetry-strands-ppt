import { ref } from 'vue';
import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import i18n from '@/locales/i18n';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import zhTW from 'ant-design-vue/es/locale/zh_TW';
import esES from 'ant-design-vue/es/locale/es_ES';
import frFR from 'ant-design-vue/es/locale/fr_FR';
import ruRU from 'ant-design-vue/es/locale/ru_RU';
import ptPT from 'ant-design-vue/es/locale/pt_PT';
import deDE from 'ant-design-vue/es/locale/de_DE';
import jaJP from 'ant-design-vue/es/locale/ja_JP';
import itIT from 'ant-design-vue/es/locale/it_IT';
import koKR from 'ant-design-vue/es/locale/ko_KR';
import viVN from 'ant-design-vue/es/locale/vi_VN';
import type { LocaleType } from '@/types/index';

import 'dayjs/locale/zh-cn';
import 'dayjs/locale/zh-tw';
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/ru';
import 'dayjs/locale/pt';
import 'dayjs/locale/de';
import 'dayjs/locale/ja';
import 'dayjs/locale/it';
import 'dayjs/locale/ko';
import 'dayjs/locale/vi';

/*
 * 语言常量
 */
const localeSettings = {
  en_US: {
    antLocale: enUS,
    dayjsLocale: 'en',
  },
  zh_CN: {
    antLocale: zhCN,
    dayjsLocale: 'zh-cn',
  },
  zh_TW: {
    antLocale: zhTW,
    dayjsLocale: 'zh-tw',
  },
  es_ES: {
    antLocale: esES,
    dayjsLocale: 'es',
  },
  fr_FR: {
    antLocale: frFR,
    dayjsLocale: 'fr',
  },
  ru_RU: {
    antLocale: ruRU,
    dayjsLocale: 'ru',
  },
  pt_PT: {
    antLocale: ptPT,
    dayjsLocale: 'pt',
  },
  de_DE: {
    antLocale: deDE,
    dayjsLocale: 'de',
  },
  ja_JP: {
    antLocale: jaJP,
    dayjsLocale: 'ja',
  },
  it_IT: {
    antLocale: itIT,
    dayjsLocale: 'it',
  },
  ko_KR: {
    antLocale: koKR,
    dayjsLocale: 'ko',
  },
  vi_VN: {
    antLocale: viVN,
    dayjsLocale: 'vi',
  },
};

/**
 * 获取浏览器默认的语言
 */
const getSystemLang = (): LocaleType => {
  const { language } = window.navigator;

  // 简体中文
  if (language === 'zh-CN') {
    return 'zh_CN';
  }
  // 其他中文默认繁体
  if (language.includes('zh')) {
    return 'zh_TW';
  }
  // 英文
  if (language.includes('en')) {
    return 'en_US';
  }
  // 西班牙语
  if (language.includes('es')) {
    return 'es_ES';
  }
  // 法语
  if (language.includes('fr')) {
    return 'fr_FR';
  }
  // 俄语
  if (language.includes('ru')) {
    return 'ru_RU';
  }
  // 葡萄牙语
  if (language.includes('pt')) {
    return 'pt_PT';
  }
  // 德语
  if (language.includes('de')) {
    return 'de_DE';
  }
  // 日语
  if (language.includes('ja')) {
    return 'ja_JP';
  }
  // 意大利语
  if (language.includes('it')) {
    return 'it_IT';
  }
  // 韩语
  if (language.includes('kr')) {
    return 'ko_KR';
  }
  // 越南文
  if (language.includes('vi')) {
    return 'vi_VN';
  }
  // 缺省语言
  return 'en_US';
};

/*
 * 多语言设置
 */
export default defineStore('locale', () => {
  // 当前语言
  const locale = ref<LocaleType>('en_US');
  const antLocale = ref(localeSettings['en_US' as LocaleType].antLocale);

  // 更改语言
  const setLocale = (value: LocaleType) => {
    locale.value = value;
    i18n.global.locale = value;
    antLocale.value = localeSettings[value].antLocale;
    dayjs.locale(localeSettings[value].dayjsLocale);

    localStorage.setItem('LOCALE', value);
  };

  // 预设语言
  const initLocale = () => {
    const storageLocale = localStorage.getItem('LOCALE');
    if (!storageLocale) {
      // 获取浏览器语言
      setLocale(getSystemLang());
      return;
    }

    setLocale(storageLocale as LocaleType);
  };

  /*
   * 根据不同语言，返回不同内容
   * 通常用于样式处理
   */
  interface IFormLabelColOptions<T> {
    default: T;
    [key: string]: T;
  }
  const getLocalOption = (options: IFormLabelColOptions<any>) => {
    if (options[locale.value]) {
      return options[locale.value];
    }

    return options.default;
  };

  return {
    locale,
    antLocale,

    initLocale,
    getLocalOption,
  };
});
