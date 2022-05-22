import 'urlpattern-polyfill';
import { DEV } from './constants.js';

/**
 * @typedef {import('./types').RouteRecord} RouteRecord
 */

export class Matcher {
  /**
   * @type {(RouteRecord & { pattern: URLPattern })[]}
   */
  #proutes = [];

  /** @param {RouteRecord[]} routes */
  constructor(routes) {
    this.#build_routes(routes);
  }

  /** @param {string} url */
  match(url) {
    for (const proute of this.#proutes) {
      const res = proute.pattern.exec({ pathname: url });
      const { pathname, searchParams, hash } = new URL(url, 'http://a.com');
      if (res) {
        return {
          pathname,
          params: Object.fromEntries(
            Object.entries(res.pathname.groups).map(([k, v]) => [
              k,
              v?.includes('/') ? v.split('/') : v,
            ]),
          ),
          search_params: searchParams,
          hash,
          matched: [proute],
        };
      }
    }
  }

  /**
   * @param {RouteRecord[]} routes
   */
  #build_routes(routes) {
    for (const route of routes) {
      const { component, components, meta, redirect_from } = route;
      let { pathname } = route;

      if (DEV && component && components) {
        throw new Error(`"component" and "components" are mutually exclusive.`);
      }

      this.#proutes.push({
        // eslint-disable-next-line no-undef
        pattern: new URLPattern({ pathname }),
        pathname,
        components: component ? { default: component } : components,
        meta,
        redirect_from,
      });
    }
  }
}
