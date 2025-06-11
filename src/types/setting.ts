/* 设置项 */
export interface ISetting {
  id?: string;
  settingId: string;
  key: string;
  value?: string;
  remark?: string;
  [key: string]: any;
}
