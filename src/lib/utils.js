import { CLIENT } from './constants.js';

/** @param  {string[]} args */
export function warn(...args) {
  console.warn('[svelte-ruta warn]: ' + args);
}

/** @param {string} [base] */
export function normalize_base(base = '') {
  if (CLIENT && !base.length) {
    const url = document.querySelector('base')?.getAttribute('href');
    base = url ? new URL(url).pathname : '';
  }
  return base.replace(/\/$/, '');
}
