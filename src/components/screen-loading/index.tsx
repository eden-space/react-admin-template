import React from 'react';
import { Spin } from 'antd';
import s from './index.module.less';

const ScreenLoading: React.FC = () => (
  <div className={s.loading}>
    <Spin tip="组件加载中..." />
  </div>
);

export default ScreenLoading;
