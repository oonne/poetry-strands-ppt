// 时间
declare type Timer = ReturnType<typeof setTimeout> | null;
declare type Interval = ReturnType<typeof setInterval> | null;

// 多语言
declare type LangCode =
  | 'en'
  | 'zh-CN'
  | 'zh-TW'
  | 'es'
  | 'fr'
  | 'ru'
  | 'pt'
  | 'de'
  | 'ja'
  | 'it'
  | 'ko'
  | 'vi';
declare type LocaleType =
  | 'en_US'
  | 'zh_CN'
  | 'zh_TW'
  | 'es_ES'
  | 'fr_FR'
  | 'ru_RU'
  | 'pt_PT'
  | 'de_DE'
  | 'ja_JP'
  | 'it_IT'
  | 'ko_KR'
  | 'vi_VN';

declare interface ILangMsg {
  en_US: string; // 英文
  zh_CN: string; // 中文
  zh_TW: string; // 中文(繁体)
  es_ES: string; // 西班牙语
  fr_FR: string; // 法语
  ru_RU: string; // 俄语
  pt_PT: string; // 葡萄牙语
  de_DE: string; // 德语
  ja_JP: string; // 日语
  it_IT: string; // 意大利语
  ko_KR: string; // 韩语
  vi_VN: string; // 越南文
}
declare interface ILangMsgs {
  [key: string | number]: ILangMsg;
}
