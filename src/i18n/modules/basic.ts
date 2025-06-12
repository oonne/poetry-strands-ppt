/*
 * 国际化翻译
 */
const msg: ILangMsgs = {
  lang_name: {
    en_US: 'English',
    zh_CN: '中文（简体）',
    zh_TW: '中文（繁体）',
    es_ES: 'Español',
    fr_FR: 'Français',
    ru_RU: 'Русский',
    pt_PT: 'Português',
    de_DE: 'Deutsch',
    ja_JP: '日本語',
    it_IT: 'Italiano',
    ko_KR: '한국어',
    vi_VN: 'Tiếng Việt',
  },

  // 测试插值
  test_interpolation: {
    en_US: 'Hello, {name}!',
    zh_CN: '你好，{name}！',
    zh_TW: '你好，{name}！',
    es_ES: 'Hola, {name}!',
    fr_FR: 'Bonjour, {name}!',
    ru_RU: 'Привет, {name}!',
    pt_PT: 'Olá, {name}!',
    de_DE: 'Hallo, {name}!',
    ja_JP: 'こんにちは, {name}!',
    it_IT: 'Ciao, {name}!',
    ko_KR: '안녕하세요, {name}!',
    vi_VN: 'Xin chào, {name}!',
  },
};

export default msg;
