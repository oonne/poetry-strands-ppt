import recycleTypeList from '@/constant/recycle-type';
import type { RecycleType } from '@/types/recycle';

/* 获取回收类型名称 */
export const getRecycleTypeName = (type: RecycleType) => {
  const recycleType = recycleTypeList.find((item) => item.type === type);
  return recycleType?.name || '';
};

/* 获取回收类型筛选项 */
export const getRecycleTypeFilters = () => recycleTypeList.map((item) => ({
  text: item.name,
  value: item.type,
}));
