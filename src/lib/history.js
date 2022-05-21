import { CLIENT } from './constants.js';

/**
 * @typedef {{
 *    g(href: string, replace: boolean): void;
 *    s(fn: (e: HashChangeEvent | PopStateEvent) => any): void;
 * }} HistoryWrapper
 */

/**
 * @param {string} [base]
 * @param {boolean} [hash]
 * @returns {HistoryWrapper}
 */
export function make_history(base, hash) {
  base = normalize_base(base);

  return {
    /** go */ g(href, replace) {
      if (replace) {
        history.replaceState(null, '', base + href);
      } else {
        history.pushState(null, '', base + href);
      }
    },
    /** start */ s(fn) {
      window.addEventListener(hash ? 'hashchange' : 'popstate', fn);
    },
  };
}

/** @param {string} [base] */
function normalize_base(base) {
  if (!base) {
    if (CLIENT) {
      const url = document.querySelector('base')?.getAttribute('href');
      base = url ? new URL(url).pathname : '';
    } else {
      base = '';
    }
  }
  return base.replace(/\/$/, '');
}
