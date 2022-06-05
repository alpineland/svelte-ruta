import { CLIENT, DEV } from './constants.js';
import { Matcher } from './matcher.js';
import { normalise_base } from './utils.js';
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
 * Get the router provided via the context of a root component.
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
  #base_seg;
  #base_url;
  #matcher;
  #scroll;

  /** @param {import('./types').RouterOptions} options */
  constructor(options) {
    const { base, hash = false, routes, scroll, url } = options;

    if (DEV) {
      if (!url) throw new Error(`"url" is required in router options.`);
      if (!routes) throw new Error(`"routes" is required in router options.`);
    }

    [this.#base_url, this.#base_seg] = normalise_base(url, base);
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
        this.navigate(location.href, true),
      );

      this.navigate(url);
    }
  }

  /**
   * Get the normalised base.
   */
  get base() {
    return this.#base_seg;
  }

  /**
   * @param {string} href
   * @param {boolean} replace false
   */
  async navigate(href, replace = false) {
    const url = new URL(href, this.#base_url);
    href = url.pathname.replace(this.#base_seg, '') + url.search + url.hash;
    const matched = await this.#matcher.match(href, this.#base_url);
    internal_route.set(matched);

    if (CLIENT) {
      history.scrollRestoration = 'manual';
      const h_url = this.#base_url + href;
      if (replace) history.replaceState(null, '', h_url);
      else history.pushState(null, '', h_url);

      if (this.#scroll) this.#scroll();
      else scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }
}
