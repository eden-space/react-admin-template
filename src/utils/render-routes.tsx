import React from 'react';
import { Route, Redirect } from 'react-router';
import { LoadableComponent } from '@loadable/component';

import { checkPermissions } from '@/utils/functions';

export interface IRouteMetaConfig {
  // 元数据
  icon?: React.ReactElement | null; // icon
  title?: string; // 菜单标题，同时会作为网页标题，如不能满足请自行扩展字段
  hidden?: boolean; // 是否被从导航栏隐藏
  some?: boolean; // 鉴权逻辑，authorities满足其一即为有权限
  authorities?: string[]; // 权限列表
  fallback?: string; // 无权限回退页面
}

export interface IRouterConfig {
  key?: string; // key
  path: string; // 路由地址
  exact?: boolean; // 精确匹配
  strict?: boolean; // 严格匹配
  sensitive?: boolean; // 是否区分大小写匹配
  redirect?: string; // 重定向路由地址
  render?: (props: any) => React.ReactElement;
  component?: LoadableComponent<any> | React.ComponentType<any> | null;
  meta?: IRouteMetaConfig; // 元数据
  children?: IRouterConfig[]; // 子路由
}

export interface ICommonObject {
  [key: string]: any;
}

export interface IExtraProps extends ICommonObject {
  // 权限配置默认使用对象
  permissions?: string[];
}

function generatorRoute(
  route: IRouterConfig,
  index: number,
  extraProps?: IExtraProps,
): React.ReactElement {
  const permissions = extraProps?.permissions;
  const meta = route?.meta;
  const fallback = meta?.fallback;
  const authorities = meta?.authorities;

  return (
    <Route
      key={route.key || index}
      path={route.path}
      exact={route.exact}
      strict={route.strict}
      render={(props): React.ReactNode => {
        if (!checkPermissions(permissions, authorities, route.meta?.some)) {
          return (
            <Redirect
              to={{
                pathname: fallback || '/errors/403',
                state: { from: props.location },
              }}
            />
          );
        }
        if (route.render) {
          return route.render({ ...props, ...extraProps, route });
        }
        if (route.component) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return <route.component {...props} {...extraProps} route={route} />;
        }
        return null;
      }}
    />
  );
}

function renderRoutes(routes: IRouterConfig[], extraProps?: IExtraProps): React.ReactElement[] {
  const routers: React.ReactElement[] = [];

  function travel(routerList: IRouterConfig[]): void {
    routerList.forEach((route, index) => {
      routers.push(generatorRoute(route, index, extraProps));

      if (Array.isArray(route.children)) {
        travel(route.children);
      }
    });
  }

  if (Array.isArray(routes)) {
    travel(routes);
  }

  return routers;
}

function getRedirectsRoutes(routes: IRouterConfig[]): React.ReactElement[] {
  const redirects: React.ReactElement[] = [];

  function travel(list: IRouterConfig[]): void {
    list.forEach((route) => {
      if (route.redirect) {
        redirects.push(<Redirect exact key={route.path} from={route.path} to={route.redirect} />);

        if (route.children) {
          travel(route.children);
        }
      }
    });
  }

  travel(routes);

  return redirects;
}

function getFlattenedRoutes(list: IRouterConfig[]) {
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

export { renderRoutes, getRedirectsRoutes, getFlattenedRoutes };
