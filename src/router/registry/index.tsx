import React from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { lazyLoadWithReactLazy } from '@/router/lazy-load';
import { IRouterConfig } from '@/router/render-routes';

const routes: IRouterConfig[] = [
  {
    path: '/',
    element: lazyLoadWithReactLazy(() => import('@/pages/lottie-player')),
    meta: {
      title: 'Lottie Player',
      menu: {
        label: 'Lottie Player',
        icon: <HomeOutlined />,
      },
    },
  },
];

export default routes;
