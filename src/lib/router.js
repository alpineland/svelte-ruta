import { CLIENT } from './constants.js';
import { make_history } from './history.js';
import { Matcher } from './matcher.js';
import { getContext } from 'svelte';
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

export const ROUTER_KEY = Symbol();

/**
 * Retrieve the router provided via context of the root component.
 * @returns {Router}
 */
export function get_router() {
  return getContext(ROUTER_KEY);
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
      addEventListener('click', (e) => {
        const anchor = /** @type {HTMLElement} */ (e.target).closest('a');
        if (anchor) {
          const {
            target,
            relList,
            pathname,
            search,
            hash,
            protocol,
            hostname,
          } = anchor;
          if (
            // don't trigger on modifier keys
            !e.ctrlKey &&
            !e.shiftKey &&
            !e.altKey &&
            !e.metaKey &&
            // dont' trigger when defaultPrevented called
            !e.defaultPrevented &&
            // don't trigger if there is `download` attribute
            !anchor.hasAttribute('download') &&
            // don't trigger if there is `external` in `rel` attribute
            !relList.contains('external') &&
            // trigger only on left button click
            e.button === 0 &&
            // trigger if target not blank
            target !== '_blank' &&
            // trigger only for internal links
            protocol === location.protocol &&
            hostname === location.hostname
          ) {
            e.preventDefault();
            if (location.pathname !== pathname) {
              this.navigate(pathname + search + hash);
            }
          }
        }
      });

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
