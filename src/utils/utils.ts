import CryptoJS from 'crypto-js';

/**
 *  获取n位的数字随机数
 */
const randomDigits = (n: number): number => {
  if (n > 21) {
    return 0;
  }
  return Math.round((Math.random() + 1) * 10 ** (n - 1));
};

/**
 *  获取n以内的随机整数
 */
const randomWithin = (n: number): number => Math.floor(Math.random() * n);

/**
 *  获取n位的随机数字或字母
 */
const randomChars = (n: number): string => {
  const arr: string[] = [];
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

  for (let i = 0; i < n; i += 1) {
    arr.push(chars[randomWithin(chars.length)]);
  }

  return arr.join('');
};

/*
 * 获取哈希值
 */
const createHash = (text: string, maxLen?: number): string => {
  const length = maxLen || 16;
  let hashedText = CryptoJS.SHA256(text).toString();
  if (hashedText.length > length) {
    hashedText = hashedText.substring(0, length);
  }
  return hashedText;
};

/*
 * 生成一个ID
 */
const generateId = (prefix?: string) => {
  const id = createHash(`${new Date().getTime()}${randomChars(4)}`, 8);
  return prefix ? `${prefix}-${id}` : id;
};

/**
 *  延迟一定时间，单位毫秒。
 */
const sleep = async (time: number): Promise<void> => new Promise((resolve) => {
  setTimeout(resolve, time);
});

/**
 * 函数防抖
 */
const debounce = <T extends (...args: any[]) => any>(fn: T, waitTime: number): ((...args: Parameters<T>) => void) => {
  let timer: Timer = null;

  return (...args: Parameters<T>) => {
    if (timer !== null) {
      clearTimeout(timer);
    }

    // 停止触发n秒后才执行
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, waitTime);
  };
};

/**
 * 获取url中的参数
 */
const getUrlParams = (name: string): string => {
  const reg = new RegExp(`(^|&)${name}=([^&#]*)(#|&|$)`, 'i');
  const url = window.location.href;
  const search = url.substring(url.lastIndexOf('?'));
  const r = search.substring(1).match(reg);
  if (r === null) {
    return '';
  }
  return decodeURIComponent(r[2]);
};

// 获取url中的所有参数
const getAllUrlParams = (): { [key: string]: string } => {
  const url = window.location.href;
  const queryString = url.split('?')[1] || '';
  return queryString.split('&').reduce((params, param) => {
    const [key, value] = param.split('=');
    if (key) {
       
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
    return params;
  }, {} as { [key: string]: string });
};

/*
 * 获取文件的MD5
 */
const getFileMd5 = async (file: File): Promise<string> => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = () => {
    const wordArray = CryptoJS.lib.WordArray.create(reader.result as ArrayBuffer);
    const md5 = CryptoJS.MD5(wordArray).toString();
    resolve(md5);
  };
  reader.readAsArrayBuffer(file);
});

/*
 * 16进制的颜色转化为rgb
 */
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : {
    r: 0,
    g: 0,
    b: 0,
  };
};

/* 
 * 导出
 */
const utils = {
  randomDigits,
  randomWithin,
  randomChars,
  createHash,
  generateId,
  sleep,
  debounce,
  getUrlParams,
  getAllUrlParams,
  getFileMd5,
  hexToRgb,
};

export default utils;
