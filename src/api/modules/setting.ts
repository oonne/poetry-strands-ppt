import request from '../req';

export default {
  // 查询设置列表
  getList(data: object) {
    return request({
      url: '/setting/get-list',
      data,
    });
  },

  // 查询设置详情
  getDetail(data: object) {
    return request({
      url: '/setting/get-detail',
      data,
    });
  },

  // 新增设置项
  addSetting(data: object) {
    return request({
      url: '/setting/add',
      data,
    });
  },

  // 编辑设置项
  updateSetting(data: object) {
    return request({
      url: '/setting/update',
      data,
    });
  },

  // 删除设置项
  deleteSetting(data: object) {
    return request({
      url: '/setting/delete',
      data,
    });
  },
};
