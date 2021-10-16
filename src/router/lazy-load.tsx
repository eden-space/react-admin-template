import React from 'react';
import loadable, { OptionsWithResolver } from '@loadable/component';
import { Helmet } from 'react-helmet';
import NProgress from '@/components/n-progress';
// import ScreenLoading from '@/components/screen-loading';
import { IMetaProps } from '@/router/render-routes';

type LoaderFunc = () => Promise<{ default: React.ComponentType<any> }>;
type RouterContainerProps = {
  meta?: IMetaProps;
  children: React.ReactElement
};

const Fallback = () => (
  <>
    <NProgress />
    {/* <ScreenLoading /> */}
  </>
);

export const RouterContainer: React.FC<RouterContainerProps> = (props) => {
  const { meta } = props;

  return (
    <>
      <Helmet>
        <title>{meta?.title}</title>
      </Helmet>
      {props.children}
    </>
  );
};

export function lazyLoadWithLoadable(
  loader: LoaderFunc,
  options?: OptionsWithResolver<unknown>,
): React.ReactElement {
  const LazyComp = loadable(loader, { ...options, fallback: <Fallback /> });

  return (
    <RouterContainer>
      <LazyComp />
    </RouterContainer>
  );
}

export function lazyLoadWithReactLazy(
  loader: LoaderFunc,
): React.ReactElement {
  const LazyComp = React.lazy(loader);

  return (
    <RouterContainer>
      <React.Suspense fallback={<Fallback />}>
        <LazyComp />
      </React.Suspense>
    </RouterContainer>
  );
}
