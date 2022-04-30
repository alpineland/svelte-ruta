import { createMatchFn } from './matcher';
import { client, warn } from './utils';
import { Writable, Readable, writable } from 'svelte/store';

import type { NormalizedRouteRecord } from './types';
import type { HistoryWrapper } from './history';
import type { RouteRecord } from './types';

export interface Router {
  navigate(to: string, replace?: boolean): void;
}

export interface Route {
  pathname: string;
  params: Record<string, string | string[]>;
  query: Record<string, string>;
  hash: string;
  matched: NormalizedRouteRecord[];
}

export let navigate: Router['navigate'];

export function createRouter(
  history: HistoryWrapper | null,
  routes: RouteRecord[],
): Router {
  if (__DEV__ && !client && history) {
    warn(
      'history prop should be null on server side. ' +
        'This will break in production if not fixed.',
    );
    history = null;
  }

  const match = createMatchFn(routes);

  navigate = (to, replace) => {
    if (!to.includes('://')) to = location.origin + to;
    const matched = match(to);
    internal_route.set(matched);
    history && history.g(to, replace);
  };

  if (client) {
    navigate(location.href);
    history && history.s(() => navigate(location.href));
  }

  return {
    navigate,
  };
}

export const internal_route: Writable<Route> = writable({
  pathname: '/',
  params: {},
  query: {},
  hash: '',
  matched: [],
});

/**
 * A global route store to tell us about the current route info.
 */
export const route: Readable<Route> = {
  subscribe: internal_route.subscribe,
};
