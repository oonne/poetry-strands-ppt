import request from '../req';

export default {
  // 查询博客列表
  getList(data: object) {
    return request({
      url: '/blog/get-list',
      data,
    });
  },

  // 查询博客详情
  getDetail(data: object) {
    return request({
      url: '/blog/get-detail',
      data,
    });
  },

  // 新增博客
  addBlog(data: object) {
    return request({
      url: '/blog/add',
      data,
    });
  },

  // 编辑博客
  updateBlog(data: object) {
    return request({
      url: '/blog/update',
      data,
    });
  },

  // 删除博客
  deleteBlog(data: object) {
    return request({
      url: '/blog/delete',
      data,
    });
  },

  // 静态化
  generateBlog() {
    return request({
      url: '/blog/generate-blog',
    });
  },
};
