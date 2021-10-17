/**
 * 本项目使用了@loadable/component
 * 如果使用其他或者React.Suspense请注意`@/utils/render-routes.tsx`方法相关props的处理
 */
import { ComponentType } from 'react';
import loadable, { LoadableComponent } from '@loadable/component';

// eslint-disable-next-line max-len
export default function load<Component extends ComponentType<any>>(factory: () => Promise<{ default: Component }>): LoadableComponent<Component> {
  return loadable(factory);
}
