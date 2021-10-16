// eslint-disable spaced-comment
import React, { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Menu } from '@/router';
// import Aside from './components/aside';

import s from './index.module.less';

export interface IBaseLayoutProps {
  children: React.ReactElement;
}

const BaseLayout: React.FC<IBaseLayoutProps> = (props) => {
  const { children } = props;
  // const l = useLocation();
  // const navigate = useNavigate();

  useEffect(() => {
    const themeMedia = window.matchMedia('(prefers-color-scheme: light)');
    console.log(themeMedia.matches, 'light - true');
    themeMedia.addListener((e) => {
      if (e.matches) {
        console.log('light', e);
      } else {
        console.log('dark');
      }
    });
  }, []);

  // function onHandleMenuSelect(item: { key: string }) {
  //   if (item.key.replace(/\/$/, '') !== l.pathname) {
  //     navigate(item.key);
  //   }
  // }

  return (
    <section className={s.app}>
      {/* <header className={s.header}> */}
      {/*   <Menu */}
      {/*    theme="light" */}
      {/*    mode="horizontal" */}
      {/*    level="one" */}
      {/*    className={s['header-menu']} */}
      {/*    selectedKeys={[l.pathname]} */}
      {/*    onSelect={onHandleMenuSelect} */}
      {/*  /> */}
      {/* </header> */}
      <section className={s.body}>
        {/* <Aside /> */}
        <main className={s.main}>{children}</main>
      </section>
      {/* <footer className={s.footer}> */}
      {/*  <span>{`Copyright © ${new Date().getFullYear()} Lottie Player. No rights reserved`}</span> */}
      {/* </footer> */}
    </section>
  );
};

export default BaseLayout;
