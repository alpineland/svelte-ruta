/**
 * A global route store to tell us about the current route info.
 */

import { Writable, Readable, writable } from 'svelte/store';
import type { NormalizedRouteRecord } from './types';

export interface Route {
  pathname: string;
  params: Record<string, string | string[]>;
  query: Record<string, string>;
  hash: string;
  matched: NormalizedRouteRecord[];
}

export const internal_route: Writable<Route> = writable({
  pathname: '/',
  params: {},
  query: {},
  hash: '',
  matched: [],
});

export const route: Readable<Route> = {
  subscribe: internal_route.subscribe,
};
