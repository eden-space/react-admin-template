import React from 'react';
import { Routes, Route } from 'react-router-dom';

export interface IMetaShowMenuProps {
  title?: string; // 网页标题
  menu?: {
    label: string;
    key?: string; // 此字段留用，当前不会取值
    icon?: React.ReactNode;
    hidden?: false;
  }; // 菜单配置
}

export interface IMetaHideMenuProps {
  title?: string; // 网页标题
  menu?: {
    label?: string;
    key?: string; // 此字段留用，当前不会取值
    icon?: React.ReactNode;
    hidden: true;
  }; // 菜单配置，父级不配置meta或者hidden为true，子级也不会展示
}

export type IMetaProps = IMetaShowMenuProps | IMetaHideMenuProps;

export interface IIndexRouterConfig {
  index: true;
  element?: React.ReactElement;

  meta?: IMetaProps; // 元数据
}

export interface IPathRouterConfig {
  path: string;

  index?: false;
  caseSensitive?: boolean;
  element?: React.ReactElement;

  meta?: IMetaProps; // 元数据
  children?: (IPathRouterConfig | IIndexRouterConfig)[]; // 子路由
}

export type IRouterConfig = IPathRouterConfig | IIndexRouterConfig;

function getRoute(config: IRouterConfig, index: number, children?: React.ReactNode): React.ReactElement {
  if (config.index) {
    return (
      <Route
        key={index}
        index
        element={config.element ? React.cloneElement(config.element, { meta: config.meta }) : undefined}
      />
    );
  }

  const { path, caseSensitive, element } = config;
  return (
    <Route
      key={index}
      path={path}
      caseSensitive={caseSensitive}
      element={element ? React.cloneElement(element, { meta: config.meta }) : undefined}
    >
      {children}
    </Route>
  );
}

function generateRoutes(routes: IRouterConfig[]): React.ReactNode {
  if (!Array.isArray(routes) || !routes.length) {
    return null;
  }

  return routes.map((config, index) => {
    if (config.index) {
      return getRoute(config, index);
    }

    const { children } = config;

    if (!children || children.length === 0) {
      return getRoute(config, index);
    }

    return getRoute(config, index, generateRoutes(children));
  });
}

function renderRoutes(routes: IRouterConfig[]): React.ReactElement {
  return (
    <Routes>
      {generateRoutes(routes)}
    </Routes>
  );
}

export { renderRoutes };
