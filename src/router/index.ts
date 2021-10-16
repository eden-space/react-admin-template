import routes from '@/router/registry';
import Menu, { menuItems } from './render-menu';
import { renderRoutes } from './render-routes';
import { lazyLoadWithLoadable, lazyLoadWithReactLazy } from './lazy-load';

const Routers = renderRoutes(routes);

export {
  routes,
  menuItems,
  Menu,
  renderRoutes,
  lazyLoadWithLoadable,
  lazyLoadWithReactLazy,
};

export default Routers;
