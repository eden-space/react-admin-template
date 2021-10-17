/**
 * 处理一些全局逻辑
 */
import React, { useRef, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router';
import { flattenedRoutes } from '@/router';
import config from '@/config';

interface IProps {
  children: React.ReactElement;
}

const BaseContainer: React.FC<IProps> = (props) => {
  const history = useHistory();
  const location = useLocation();
  const { current: originTitle } = useRef(document.title);

  useEffect(() => {
    setTitle(location.pathname);

    const unregisterCallback = history.listen(({ pathname }) => {
      setTitle(pathname);
    });

    return () => {
      unregisterCallback();
      document.title = originTitle;
    };
  }, []);

  function setTitle(pathname: string) {
    const match = flattenedRoutes.find((route) => route.path === pathname);
    document.title = match?.meta?.title ? `${config.systemName} - ${match.meta.title}` : originTitle;
  }

  return props.children;
};

export default BaseContainer;
