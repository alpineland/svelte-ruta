import 'urlpattern-polyfill';
import type { Route, RouteRecord } from './types';

export function createMatchFn(routes: RouteRecord[]) {
  const proutes = routes.map(({ pathname, ...rest }) => ({
    ...rest,
    pattern: new URLPattern({ pathname }),
  }));

  return (url: string): Route => {
    for (const { pattern, ...rest } of proutes) {
      const temp = pattern.exec(url);
      if (temp) {
        return {
          pathname: new URL(url).pathname,
          params: Object.fromEntries(
            Object.entries(temp.pathname.groups).map(([k, v]) => [
              k,
              v?.includes('/') ? v.split('/') : v,
            ]),
          ),
          query: Object.fromEntries(
            Object.entries(temp.search.groups).map(([k, v]) => [
              k,
              v?.includes('/') ? v.split('/') : v,
            ]),
          ),
          hash: '',
          matched: [
            {
              ...rest,
              components: {
                default: rest.component,
              },
            },
          ],
        };
      }
    }
  };
}
