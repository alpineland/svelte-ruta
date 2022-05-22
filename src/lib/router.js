import { CLIENT } from './constants.js';
import { make_history } from './history.js';
import { Matcher } from './matcher.js';
import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';

/**
 * @typedef {{
 *    pathname: string;
 *    params: Record<string, string | string[]>;
 *    search_params: URLSearchParams;
 *    hash: string;
 *    matched: import('./types').NormalizedRouteRecord[]
 * }} Route
 */

const ROUTER_KEY = Symbol();

/**
 * Retrieve the router provided via {@link set_router}.
 *
 * @returns {Router}
 */
export function get_router() {
  return getContext(ROUTER_KEY);
}

/**
 * Set router for all child components.
 * This should be called inside root component so that child components can
 * access the router.
 *
 * To retrieve the router, use {@link get_router}.
 *
 * @param {Router} router
 */
export function set_router(router) {
  setContext(ROUTER_KEY, router);
}

/** @type {import('svelte/store').Writable<Route>} */
export const internal_route = writable();

/**
 * A global route store to tell us about the current route info.
 * @type {import('svelte/store').Readable<Route>}
 */
export const route = { subscribe: internal_route.subscribe };

export class Router {
  /** @type {import('./history.js').HistoryWrapper | null} */
  #history;

  #matcher;

  #scroll;

  /** @param {import('./types').RouterOptions} options */
  constructor(options) {
    const { base = '/', hash = false, routes, scroll } = options;
    this.#history = CLIENT ? make_history(base, hash) : null;
    this.#matcher = new Matcher(routes);
    this.#scroll = scroll;

    if (CLIENT) {
      const href = location.href.replace(location.origin, '');
      this.navigate(href);
      this.#history && this.#history.s(() => this.navigate(href));
    }
  }

  /**
   * @param {string} href
   * @param {boolean} replace false
   */
  navigate(href, replace = false) {
    const matched = this.#matcher.match(href);
    internal_route.set(matched);

    this.#history && this.#history.g(href, replace);
    if (CLIENT) {
      if (this.#scroll) this.#scroll();
      else scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }
}
