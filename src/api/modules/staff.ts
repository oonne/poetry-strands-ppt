import request from '../req';

export default {
  // 查询账号列表
  getList(data: object) {
    return request({
      url: '/staff/get-list',
      data,
    });
  },

  // 查询账号详情
  getDetail(data: object) {
    return request({
      url: '/staff/get-detail',
      data,
    });
  },

  // 更新RefreshToken
  updateRefreshToken(data: object) {
    return request({
      url: '/staff/update-refresh-token',
      data,
    });
  },

  // 新增账号
  addStaff(data: object) {
    return request({
      url: '/staff/add',
      data,
    });
  },

  // 编辑账号
  updateStaff(data: object) {
    return request({
      url: '/staff/update',
      data,
    });
  },

  // 删除账号
  deleteStaff(data: object) {
    return request({
      url: '/staff/delete',
      data,
    });
  },
};
