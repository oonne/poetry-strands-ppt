// 回收类型: 1账号 2配置 3博客
export type RecycleType = 1 | 2 | 3;

/* 回收站 */
export interface IRecycle {
  id?: string;
  recycleId: string;
  type: RecycleType;
  content: string;
  deleteStaffId?: string;
  deleteStaffName?: string;
  [key: string]: any;
}
