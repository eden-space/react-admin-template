import React, { useState, useEffect } from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { getParentsRouteByPath } from '@/utils/functions';
import routes from '@/router';
import { IRouterConfig } from '@/utils/render-routes';
import s from './index.module.less';

const GlobalBreadcrumb: React.FC = () => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<IRouterConfig[]>([]);

  useEffect(() => {
    const list = getParentsRouteByPath(routes, location.pathname);
    setBreadcrumbs(list.filter(({ path }) => path !== '/').reverse());
  }, [location.pathname]);

  return (
    <>
      {breadcrumbs.length ? (
        <section className={s.breadcrumb}>
          <Breadcrumb>
            <Breadcrumb.Item>
              {location.pathname !== '/' && (
                <Link className={s.link} to="/">
                  <HomeOutlined className={s.mr4} />
                  首页
                </Link>
              )}
            </Breadcrumb.Item>
            {breadcrumbs.map(({ path, meta }, index) => {
              return (
                <Breadcrumb.Item key={path}>
                  <Link className={classnames(s.link, { [s.disabled]: breadcrumbs.length - 1 === index })} to={path}>
                    {meta?.icon && <span className={s.mr4}>{meta.icon}</span>}
                    {meta?.title}
                  </Link>
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
        </section>
      ) : null}
    </>
  );
};

export default GlobalBreadcrumb;
