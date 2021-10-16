import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Menu, menuItems } from '@/router';

import s from './index.module.less';

const inlineUnCollapsedWidth = 200;
const inlineCollapsedWidth = 80;

const BaseLayout: React.FC = () => {
  const l = useLocation();
  const navigate = useNavigate();
  const [inlineCollapsed, setInlineCollapsed] = useState<boolean>(false);
  const [asideWidth, setAsideWidth] = useState<number>(inlineUnCollapsedWidth);
  const firstPath = `/${l.pathname.split('/').filter(Boolean)[0]}`;

  useEffect(() => {
    const itemsLevelTwo = menuItems.find((item) => item.key === firstPath)?.children;
    const hasItemsLevelTwo = Array.isArray(itemsLevelTwo) && itemsLevelTwo.length;
    setAsideWidth(hasItemsLevelTwo ? inlineUnCollapsedWidth : 0);
    setInlineCollapsed(false);
  }, [l.pathname]);

  const defaultOpenKeys = l.pathname
    .split('/')
    .filter(Boolean)
    .reduce((p: string[], c: string) => [...p, `${p[0] ?? ''}/${c}`], [])
    .slice(0, -1);

  function onHandleMenuSelect(item: { key: string }) {
    if (item.key.replace(/\/$/, '') !== l.pathname) {
      navigate(item.key);
    }
  }

  return (
    <aside
      style={{ width: asideWidth, opacity: asideWidth ? 1 : 0 }}
      className={s.aside}
    >
      <Menu
        className={s['aside-menu']}
        theme="light"
        mode="inline"
        level="two"
        inlineCollapsed={inlineCollapsed}
        defaultOpenKeys={defaultOpenKeys}
        selectedKeys={[l.pathname]}
        onSelect={onHandleMenuSelect}
      />

      <div
        className={s['fold-icon']}
        onClick={() => {
          setAsideWidth(inlineCollapsed ? inlineUnCollapsedWidth : inlineCollapsedWidth);
          setInlineCollapsed(!inlineCollapsed);
        }}
      >
        {inlineCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined/>}
      </div>
    </aside>
  );
};

export default BaseLayout;
