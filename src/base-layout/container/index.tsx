/**
 * 处理一些全局逻辑
 */
import React, { useRef, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router';
import { flattenedRoutes } from '@/router';

interface IProps {
  children: React.ReactElement;
}

const BaseContainer: React.FC<IProps> = (props) => {
  const { current: originTitle } = useRef(document.title);
  const history = useHistory();
  const location = useLocation();

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
    document.title = match?.meta?.title || originTitle;
  }

  return props.children;
};

export default BaseContainer;
