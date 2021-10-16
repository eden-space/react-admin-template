import React from 'react';
import { HashRouter, Switch } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import BaseContainer from '@/base-layout/container';
import BaseLayout from '@/base-layout/layout';
import ErrorBoundary from '@/components/error-boundary';
import { getRedirectsRoutes, renderRoutes } from '@/utils/render-routes';
import outsiders from '@/router/outsiders';
import '@/styles/index.less';

const App: React.FC = () => {
  return (
    // <BrowserRouter>
    <HashRouter>
      <ConfigProvider locale={zhCN}>
        <ErrorBoundary>
          <BaseContainer>
            <Switch>
              {getRedirectsRoutes(outsiders)}
              {renderRoutes(outsiders)}
              <BaseLayout />
            </Switch>
          </BaseContainer>
        </ErrorBoundary>
      </ConfigProvider>
    </HashRouter>
    // </BrowserRouter>
  );
};

export default App;
