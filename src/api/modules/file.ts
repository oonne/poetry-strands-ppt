import config from '@/config/index';
import { Utils } from '@/utils/index';
import request from '../req';

const { getFileMd5 } = Utils;
export default {
  // 查询文件列表
  getList(data: object) {
    return request({
      url: '/file/get-list',
      data,
    });
  },

  // 查询文件详情
  getDetail(data: object) {
    return request({
      url: '/file/get-detail',
      data,
    });
  },

  // 删除文件
  deleteFile(data: object) {
    return request({
      url: '/file/delete',
      data,
    });
  },

  // 上传文件
  async upload({ file, type }: { file: File; type: 'img' | 'file' }) {
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('suffix', file.name.split('.').pop() || '');
    formdata.append('fileMd5', await getFileMd5(file));
    formdata.append('type', type);

    return request({
      url: '/file/upload',
      data: formdata,
      timeout: config.uploadTimeOut,
      headers: {
        'Content-Type': 'multipart/form-data; charset=utf-8',
      },
    });
  },
};
