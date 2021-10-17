import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { useLocation, useHistory } from 'react-router';

import { IRouterConfig } from '@/utils/render-routes';
import routes from '@/router';
import { checkPermissions, getParentsRouteByPath } from '@/utils/functions';

// import s from './index.module.less';
export declare type MenuMode = 'horizontal' | 'vertical' | 'inline';

export interface MenuInfo {
  key: string;
  keyPath: string[];
}

export interface IProps {
  mode?: MenuMode;
  collapsed?: boolean;
}

const { Item: MenuItem, SubMenu } = Menu;

const SiderMenu: React.FC<IProps> = (props: IProps) => {
  const location = useLocation();
  const history = useHistory();
  const [openKeys, setOpenKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    if (!props.collapsed) {
      const parents = getParentsRouteByPath(routes, location.pathname);
      setOpenKeys(parents.map((item) => item.path));
    }
  }, [location.pathname]);

  function onHandleMenuSelect(item: MenuInfo): void {
    if (location.pathname !== item.key) {
      history.push(`${item.key}`);
    }
  }

  function renderMenuItem(list?: IRouterConfig[]): null | (null | React.ReactElement)[] {
    if (!Array.isArray(list) || !list.length) {
      return null;
    }
    return list
      .map((route) => {
        const subRoutes = route.children?.filter((item) => item && !item.meta?.hidden);
        const hasSubMenu = subRoutes?.length;

        // route.children为空会认为是有效的菜单，再判断
        // 此处值判断route.children非空且全部hidden返回null
        if (route.children?.length && !hasSubMenu) {
          return null;
        }

        const authorities = route.meta?.authorities;
        if (!checkPermissions([], authorities, route.meta?.some)) {
          return null;
        }

        if (hasSubMenu) {
          return (
            <SubMenu key={route.path} title={route.meta?.title} icon={route.meta?.icon}>
              {renderMenuItem(subRoutes)}
            </SubMenu>
          );
        }

        return (
          <MenuItem key={route.path} icon={route.meta?.icon}>
            {route.meta?.title}
          </MenuItem>
        );
      })
      .filter(Boolean);
  }

  return (
    <Menu
      mode="inline"
      openKeys={openKeys as string[]}
      onOpenChange={(keys) => setOpenKeys(keys)}
      selectedKeys={[location.pathname]}
      onClick={onHandleMenuSelect}
    >
      {renderMenuItem(routes.filter((item) => !item?.meta?.hidden))}
    </Menu>
  );
};

export default SiderMenu;
