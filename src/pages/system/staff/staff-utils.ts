import roleList from '@/constant/role';
import type { Role } from '@/types/staff';

/* 获取角色名称 */
export const getRoleName = (type: Role) => {
  const role = roleList.find((item) => item.type === type);
  return role?.name || '';
};

/* 获取角色筛选项 */
export const getRoleFilters = () => roleList.map((item) => ({
  text: item.name,
  value: item.type,
}));
