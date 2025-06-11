import { message } from 'ant-design-vue';
import i18n from '@/locales/i18n';
import LangMsg from '@/locales/modules/error-code-msg';

const { t } = i18n.global;

interface IProps {
  err?: any;
  defaultMsg?: string;
}

/*
 * 构造错误提示语
 * params {object} err 错误对象
 * params {string} defaultMsg 默认错误提示语
 * return Promise<boolean> true: 确认 false: 取消
 */
const buildErrorMsg = (props: IProps): string => {
  const { err, defaultMsg } = props;

  // 请求或响应失败
  if (err?.name === 'AxiosError') {
    if (err?.response?.data?.message) {
      return err.response.data.message;
    }
    if (err?.message) {
      return err.message;
    }
  }

  // 如果是401，防止多次toast提示，前面的提示先销毁，只显示最后返回的这条提示
  if (err.code === 401) {
    message.destroy();
    return t(`${err.code}`);
  }

  // 接口错误，且错误码有i18n，则返回i18n
  if (err.code && LangMsg[err.code]) {
    // 如果有变量，则替换变量
    if (err.params) {
      return t(`${err.code}`, err.params);
    }
    // 没有则直接返回
    return t(`${err.code}`);
  }

  // 有message，则返回message
  if (err.message) {
    return err.message;
  }

  // 缺省错误
  return defaultMsg || t('msg_error');
};

export default buildErrorMsg;
