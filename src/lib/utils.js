import { CLIENT, DEV } from './constants.js';

/** @param {string[]} args */
export function warn(...args) {
  console.warn('[svelte-ruta warn]: ' + args);
}

/**
 * @param {string | URL} url Full URL - input should be `string` only, `URL` is
 * to make TS happy
 * @param {string} [base] Pathname only (default `/`)
 * @returns `[href, pathname]`
 */
export function normalise_base(url, base = '/') {
  if (DEV && !base.startsWith('/')) {
    throw new Error(`"base" should start with "/".`);
  }

  if (CLIENT && !base.length) {
    const href = document.querySelector('base')?.getAttribute('href');
    base = href ? new URL(href).pathname : base;
  }
  url = new URL(base, url);

  return [url.href, url.pathname].map((v) => v.replace(/\/$/, ''));
}
