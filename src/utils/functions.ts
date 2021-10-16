import { IRouterConfig } from '@/utils/render-routes';

export function flatRouterList(list: IRouterConfig[]) {
  const res: IRouterConfig[] = [];

  function travel(arr: IRouterConfig[]) {
    for (let i = 0; i < arr.length; i++) {
      const route = arr[i];
      const { children } = arr[i];

      res.push(route);

      if (children) {
        travel(children);
      }
    }
  }
  travel(list);

  return res;
}

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

export function getParentsRouteByPath(treeList: IRouterConfig[], value: any): IRouterConfig[] {
  if (!Array.isArray(treeList)) {
    return [];
  }

  for (let i = 0; i < treeList.length; i++) {
    if (treeList?.[i]?.path === value) {
      return [treeList[i]];
    }
    if (treeList?.[i]?.children) {
      const nodes = getParentsRouteByPath(treeList?.[i]?.children || [], value) || [];
      return nodes.concat(treeList[i]);
    }
  }

  return [];
}
