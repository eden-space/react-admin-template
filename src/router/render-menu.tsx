import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu as AntdMenu } from 'antd';
import type { MenuProps } from 'antd';
import { routes } from '@/router';
import { IRouterConfig } from '@/router/render-routes';

export type IMenuProps = Omit<MenuProps, 'items'> & {
  placement?: 'header' | 'aside';
  level?: 'one' | 'two'; // 若值为 two， 会根据当前pathname寻找二级子菜单
};
type MenuItem = {
  label?: string;
  key: string;
  icon?: React.ReactNode;
  children?: {
    label?: string;
    key: string;
    icon?: React.ReactNode;
  }[];
};

function getMenuItems(routers: IRouterConfig[], parentPath = ''): MenuItem[] {
  return routers
    .filter((item: IRouterConfig) => item.meta && item.meta.menu?.hidden !== true)
    .map((item: IRouterConfig) => {
      const menuName = item?.meta?.menu?.label || item?.meta?.title;

      if (item.index) {
        return {
          label: menuName,
          key: `${parentPath}/`,
          icon: item?.meta?.menu?.icon,
        };
      }
      const realPath = `${parentPath ? `${parentPath}/` : ''}${item.path}`;
      if (item.children) {
        return {
          label: menuName,
          key: realPath,
          icon: item?.meta?.menu?.icon,
          children: getMenuItems(item.children, realPath),
        };
      }
      return {
        label: menuName,
        key: realPath,
        icon: item?.meta?.menu?.icon,
      };
    });
}

const menuItems = getMenuItems(routes);
const itemsLevelOne = menuItems.map((item: MenuItem) => ({ label: item.label, key: item.key, icon: item.icon }));

const Menu: React.FC<IMenuProps> = (props) => {
  const { level } = props;
  const l = useLocation();

  if (level === 'one') {
    return  (
      <AntdMenu {...props} items={itemsLevelOne} />
    );
  }

  if (level === 'two') {
    const firstPath = `/${l.pathname.split('/').filter(Boolean)[0]}`;
    const itemsLevelTwo = menuItems.find((item) => item.key === firstPath)?.children;

    return (
      <AntdMenu {...props} items={itemsLevelTwo} />
    );
  }

  return (
    <AntdMenu {...props} items={menuItems} />
  );
};

export { menuItems };

export default Menu;
