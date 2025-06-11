import { message, Modal, ModalFuncProps } from 'ant-design-vue';
import i18n from '@/locales/i18n';

const { t } = i18n.global;

/*
 * 复制
 */
const copyText = (text?: string) => {
  if (!text) {
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    message.success(t('msg_clipboard_success'));
  });
};

/*
 * 确认弹框
 * return Promise<boolean> true: 确认 false: 取消
 */
const confirmModal = (props: ModalFuncProps): Promise<boolean> => new Promise((resolve) => {
  Modal.confirm({
    ...props,
    onOk: () => {
      resolve(true);
    },
    onCancel: () => {
      resolve(false);
    },
  });
});

/*
 * 浏览器通知（Notification）
 */
const sendBrowserNotify = (title: string, options?: globalThis.NotificationOptions) => {
  // 如果有权限，直接发通知
  if (window.Notification.permission === 'granted') {
    // eslint-disable-next-line no-new
    new Notification(title, options);
    return;
  }

  // 如果已拒绝，不再骚扰用户
  if (window.Notification.permission === 'denied') {
    return;
  }

  // 请求权限，同意后发通知
  window.Notification.requestPermission((permission) => {
    if (permission === 'granted') {
      // eslint-disable-next-line no-new
      new Notification(title, options);
    }
  });
};

/*
 * 下载文件
 */
const downloadFile = (fileUrl: string, fileName?: string) => {
  const downloadLink = document.createElement('a');
  downloadLink.style.display = 'none';
  downloadLink.target = '_blank';
  downloadLink.download = fileName || t('unknown_file');
  downloadLink.href = fileUrl;

  // 模拟点击链接以触发下载
  downloadLink.click();
};

export default {
  copyText,
  confirmModal,
  sendBrowserNotify,
  downloadFile,
};
