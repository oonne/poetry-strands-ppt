/* 博客 */
export interface IBlog {
  id?: string;
  blogId: string;
  title: string;
  publishDate: string;
  content: string;
  isActive: boolean;
  linkUrl: string;
  description?: string;
  keywords?: string;
  [key: string]: any;
}
