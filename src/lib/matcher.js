import 'urlpattern-polyfill';
import { DEV } from './constants.js';

/**
 * @typedef {import('./types').RouteRecord} RouteRecord
 */

export class Matcher {
  /** @type {(RouteRecord & { pattern: URLPattern })[]} */
  #proutes = [];

  /** @param {RouteRecord[]} routes */
  constructor(routes) {
    this.#make_routes(routes);
  }

  /**
   * @param {string} url
   * @param {string} base
   */
  async match(url, base) {
    for (const proute of this.#proutes) {
      const res = proute.pattern.exec(url, base);
      if (res) {
        for (const [name, comp] of Object.entries(proute.components)) {
          if (typeof comp === 'function' && !('prototype' in comp)) {
            proute.components[name] = (await comp()).default;
          }
        }
        return {
          url: new URL(url, base),
          params: res.pathname.groups,
          matched: [proute],
        };
      }
    }
  }

  /** @param {RouteRecord[]} routes */
  #make_routes(routes, _parent = { pathname: '' }) {
    for (const route of routes) {
      const { children, component, components, meta, redirect_from } = route;
      let { pathname } = route;

      if (DEV && component && components) {
        throw new Error(`"component" and "components" are mutually exclusive.`);
      }

      pathname += _parent.pathname;

      const parent = {
        // eslint-disable-next-line no-undef
        pattern: new URLPattern({ pathname }),
        pathname,
        components: component ? { default: component } : components,
        meta,
        redirect_from,
      };

      if (children?.length) this.#make_routes(children, parent);
      else this.#proutes.push(parent);
    }
  }
}
