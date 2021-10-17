import { IRouterConfig } from '@/utils/render-routes';

export function checkPermissions(permissions?: string[], authorities?: string[], some?: boolean) {
  if (!permissions || !authorities) {
    return true;
  }

  const authorizationRequired = authorities?.length > 0;

  if (!authorizationRequired) {
    return true;
  }

  return some
    ? authorities?.some((value) => permissions?.includes(value))
    : authorities?.every((value) => permissions?.includes(value));
}

export function getParentsRouteByPath(treeList: IRouterConfig[], path: string): IRouterConfig[] {
  if (!Array.isArray(treeList)) {
    return [];
  }

  for (let i = 0; i < treeList.length; i++) {
    if (treeList?.[i]?.path === path) {
      return [treeList[i]];
    }
    if (treeList?.[i]?.children) {
      const nodes = getParentsRouteByPath(treeList?.[i]?.children || [], path) || [];
      return nodes.concat(treeList[i]);
    }
  }

  return [];
}
