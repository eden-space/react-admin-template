import React from 'react';
import {
  HomeOutlined,
  DashboardOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import { lazyLoadWithReactLazy } from '@/router/lazy-load';
import { IRouterConfig } from '@/router/render-routes';
import LottiePlayer from '@/pages/lottie-player';

const routes: IRouterConfig[] = [
  {
    path: '/',
    element: <LottiePlayer />,
    meta: {
      title: 'Lottie Player',
      menu: {
        label: 'Lottie Player',
        icon: <HomeOutlined />,
      },
    },
  },
  // {
  //   path: '/',
  //   element: lazyLoadWithReactLazy(() => import('@/pages/home')),
  //   meta: {
  //     title: '首页',
  //     menu: {
  //       label: '首页',
  //       icon: <HomeOutlined />,
  //     },
  //   },
  // },
  {
    path: '/dashboard',
    element: lazyLoadWithReactLazy(() => import('@/pages/dashboard')),
    meta: {
      title: '工作台',
      menu: {
        label: '工作台',
        icon: <DashboardOutlined />,
      },
    },
  },
  {
    path: '/errors',
    meta: {
      title: '错误页面',
      menu: {
        label: '错误页面',
        icon: <AlertOutlined />,
      },
    },
    children: [
      {
        index: true,
        element: <div>errors</div>,
      },
      {
        path: '403',
        element: lazyLoadWithReactLazy(() => import('@/pages/errors/403')),
        meta: {
          title: '无当前页面权限',
          menu: {
            label: '403',
            icon: null,
          },
        },
      },
      {
        path: '404',
        element: lazyLoadWithReactLazy(() => import('@/pages/errors/404')),
        meta: {
          title: '访问出错了~',
          menu: {
            label: '404',
            icon: null,
          },
        },
      },
      {
        path: '500',
        element: lazyLoadWithReactLazy(() => import('@/pages/errors/500')),
        meta: {
          title: '服务端错误',
          menu: {
            label: '500',
            icon: null,
          },
        },
      },
      {
        path: '*',
        element: lazyLoadWithReactLazy(() => import('@/pages/errors/404')),
      },
    ],
  },
  {
    path: '/*',
    element: lazyLoadWithReactLazy(() => import('@/pages/errors/404')),
    meta: { title: '404', menu: { hidden: true } },
  },
];

export default routes;
