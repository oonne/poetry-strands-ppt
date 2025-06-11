import request from '../req';

export default {
  // 查询回收站列表
  getList(data: object) {
    return request({
      url: '/recycle/get-list',
      data,
    });
  },

  // 查询回收站详情
  getDetail(data: object) {
    return request({
      url: '/recycle/get-detail',
      data,
    });
  },

  // 删除回收站
  deleteRecycle(data: object) {
    return request({
      url: '/recycle/delete',
      data,
    });
  },
};
