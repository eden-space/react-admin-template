import React from 'react';
import { Switch } from 'react-router';
import { Layout } from 'antd';
import SiderMenu from './components/sider-menu';
import GlobalBreadcrumb from './components/global-breadcrumb';
import routes from '@/router';
import { getRedirectsRoutes, renderRoutes } from '@/utils/render-routes';

import s from './index.module.less';

const { Header, Sider, Content } = Layout;

const BaseLayout: React.FC = () => {

  return (
    <Layout className={s.appContainer}>
      <Header className={s.appHeader}>Header</Header>

      <Layout>
        <Sider className={s.appAsider}>
          <SiderMenu />
        </Sider>
        <Content className={s.appContent}>
          <GlobalBreadcrumb />

          <section className={s.routerView}>
            <Switch>
              {getRedirectsRoutes(routes)}
              {renderRoutes(routes)}
            </Switch>
          </section>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
