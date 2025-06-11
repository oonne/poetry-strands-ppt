import request from '../req';

export default {
  // 初始化
  init() {
    return request({
      url: '/auth/init',
    });
  },

  // 获取登录的pow校验
  getLoginPow(data: object) {
    return request({
      url: '/auth/get-login-pow',
      data,
    });
  },

  // 登录
  login(data: object) {
    return request({
      url: '/auth/login',
      data,
    });
  },

  // 换票
  refreshToken(data: object) {
    return request({
      url: '/auth/refresh-token',
      data,
    });
  },
};
