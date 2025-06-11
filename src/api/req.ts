import axios, { AxiosRequestConfig } from 'axios';
import { emit as busEmit } from 'eventbus-typescript';
import config from '@/config/index';
import { Utils, to } from '@/utils/index';

const { VITE_BASE_URL } = import.meta.env;
const { version, apiTimeOut } = config;
const { randomChars } = Utils;

/*
 * 获取请求头字段信息
 */
// UUID
const getUUID = () => localStorage.getItem('UUID') || '';
// Token
const getToken = () => localStorage.getItem('TOKEN') || '';
// 语言
const getLang = () => localStorage.getItem('LOCALE') || '';

/*
 * 生成请求id
 * 格式： 毫秒时间戳 - UUID末4位 - 4位随机数
 */
const generateReqId = () => {
  const timestamp = new Date().getTime();
  const uuid = getUUID();
  return `${timestamp}-${uuid.slice(-4)}-${randomChars(4)}`;
};

/*
 * 请求实体
 */
const instance = axios.create({
  baseURL: VITE_BASE_URL,
  timeout: apiTimeOut,
  method: 'post',
});

// 请求
instance.interceptors.request.use((reqOptions) => {
  const options = reqOptions;
  if (!options.headers['Content-Type']) {
    options.headers['Content-Type'] = 'application/json; charset=utf-8';
  }

  options.headers.Authorization = `Bearer ${getToken()}`;
  options.headers['x-version'] = version;
  options.headers['x-uuid'] = getUUID();
  options.headers['x-reqid'] = generateReqId();
  options.headers['x-lang'] = getLang();
  return options;
});

// 响应
instance.interceptors.response.use((res) => {
  const { data, status } = res;

  // 正常响应
  if ([200, 201].includes(status) && data.code === 0) {
    return Promise.resolve(data);
  }

  // 401 登录过期
  if (status === 401 || data.code === 401) {
    console.warn('登录过期');
    busEmit('LOGOUT');
    window.location.href = `/${window?.location?.hash}`;
  }

  return Promise.reject(data);
});

/*
 * 异步封装
 */
const req = async (options: AxiosRequestConfig) => {
  const [err, res] = await to(instance(options));
  return [err, res];
};

export default req;
