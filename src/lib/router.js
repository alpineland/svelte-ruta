import { CLIENT } from './constants.js';
import { Matcher } from './matcher.js';
import { normalize_base } from './utils.js';
import { getContext } from 'svelte';
import { writable } from 'svelte/store';

/**
 * @typedef {{
 *    url: URL;
 *    params: Record<string, string | string[]>;
 *    matched: import('./types').NormalizedRouteRecord[]
 * }} Route
 */

export const ROUTER_KEY = Symbol();

/**
 * Retrieve the router provided via context of root component.
 * @returns {Router} router
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
  #base;
  #matcher;
  #scroll;

  /** @param {import('./types').RouterOptions} options */
  constructor(options) {
    const { base, hash = false, routes, scroll } = options;

    this.#base = normalize_base(base);
    this.#matcher = new Matcher(routes);
    this.#scroll = scroll;

    if (CLIENT) {
      addEventListener('click', (e) => {
        const anchor = /** @type {HTMLElement} */ (e.target).closest('a');
        if (anchor) {
          const { href, target, relList, pathname, protocol, hostname } =
            anchor;
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
              this.navigate(href);
            }
          }
        }
      });

      addEventListener(hash ? 'hashchange' : 'popstate', () =>
        this.navigate(location.href),
      );

      this.navigate(location.href);
    }
  }

  /**
   * @param {string} href
   * @param {boolean} replace false
   */
  navigate(href, replace = false) {
    const url = new URL(href, 'http://a.a' + this.#base);
    href = url.pathname + url.search + url.hash;
    const matched = this.#matcher.match(
      href.replace(new RegExp('^' + this.#base), ''),
    );
    internal_route.set(matched);

    if (CLIENT) {
      if (replace) {
        history.replaceState(null, '', href);
      } else {
        history.pushState(null, '', href);
      }
      if (this.#scroll) this.#scroll();
      else scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }
}
