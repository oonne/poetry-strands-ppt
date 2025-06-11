/*
 * 文件、图片
 */
// 文件类型：1图片 2文件
export type FileType = 1 | 2;

// 图片
export interface IFile {
  id?: string;
  fileId: string;
  type: FileType;
  fileName: string;
  fileSize: string;
  [key: string]: any;
}
