import { writable } from 'svelte/store';
import { make_history } from './history.js';
import { CLIENT } from './constants.js';

export function init_router(settings) {
  const history = make_history(settings.base, settings.hash);
  const matcher = make_matcher(settings.routes);
}

/**
 * @typedef {{
 *    pathname: string;
 *    params: Record<string, string | string[]>;
 *    search_params: URLSearchParams;
 *    hash: string;
 *    matched: import('./types').NormalizedRouteRecord[]
 * }} Route
 */

/** @type {import('svelte/store').Writable<Route>} */
export const internal_route = writable();

/**
 * A global route store to tell us about the current route info.
 * @type {import('svelte/store').Readable<Route>}
 */
export const route = {
  subscribe: internal_route.subscribe,
};

export class Router {
  /** @type {import('./history.js').HistoryWrapper} */
  #history;

  #matcher;

  constructor(settings) {
    const { base, hash = false, routes, scroll_behavior } = settings;
    this.#history = CLIENT ? make_history(base, hash) : null;
    this.#matcher = make_matcher(routes);

    if (CLIENT) {
      const href = location.href;
      this.navigate(href);
      this.#history.s(() => this.navigate(href));
    }
  }

  /**
   * @param {string} href
   * @param {boolean} replace false
   */
  navigate(href, replace = false) {
    this.#history && this.#history.g(href, replace);
  }
}
