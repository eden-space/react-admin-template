import React, { useEffect } from 'react';
import Nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import './index.module.less';

const NProgress: React.FC = () => {
  useEffect(() => {
    Nprogress
      .configure({ showSpinner: false })
      .set(0.3)
      .start();

    return () => {
      Nprogress.done();
    };
  }, []);

  return null;
};

export default NProgress;
