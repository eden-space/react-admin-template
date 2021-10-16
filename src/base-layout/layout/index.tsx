import React, { useState } from 'react';
import { Switch } from 'react-router';
import { Layout } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import { getRedirectsRoutes, renderRoutesDeep } from '@/utils/render-routes';
import routes from '@/router';

import GlobalMenu from './components/global-menu';
import GlobalBreadcrumb from './components/global-breadcrumb';
import s from './index.module.less';

const { Header, Sider, Content } = Layout;

const BaseLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout id="app-container">
      <Header className={s.appHeader}>Header</Header>

      <Layout>
        <Sider className={s.appSider} collapsedWidth={48} collapsed={collapsed}>
          <div id="app-aside" className={s.appAside}>
            <div className={s.asideMenu}>
              <GlobalMenu collapsed={collapsed} />
            </div>
            <div
              className={s.fold}
              onClick={(): void => {
                setCollapsed(!collapsed);
              }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
          </div>
        </Sider>
        <Content className={s.appRouterView}>
          <GlobalBreadcrumb />

          <Switch>
            {getRedirectsRoutes(routes)}
            {renderRoutesDeep(routes)}
          </Switch>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
