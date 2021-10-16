import React from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import ErrorBoundary from '@/components/error-boundary';
import BaseLayout from '@/base-layout';
import Routers from '@/router';
import '@/styles/index.less';

const App: React.FC = () => (
  <ErrorBoundary>
    <ConfigProvider locale={zhCN}>
      {process.env.BUILD_TARGET === 'electron' ? (
        <HashRouter basename="/">
          <BaseLayout>
            {Routers}
          </BaseLayout>
        </HashRouter>
      ) : (
        <BrowserRouter basename="/">
          <BaseLayout>
            {Routers}
          </BaseLayout>
        </BrowserRouter>
      )}
    </ConfigProvider>
  </ErrorBoundary>
);

export default App;
