import React from 'react';
import { LoginOutlined } from '@ant-design/icons';
import load from '@/utils/load';
import { IRouterConfig } from '@/utils/render-routes';

/**
 * 不包含BaseLayout功能组件路由列表
 * @description 仅包含自己页面内数据。理论上系统级诸如登陆、无访问权限等业务无关路由放在此处
 */
const outsiders: IRouterConfig[] = [
  {
    path: '/403',
    component: load(() => import('@/pages/errors/403')),
    meta: { title: '无系统访问权限', icon: <LoginOutlined /> },
  },
];

export default outsiders;
