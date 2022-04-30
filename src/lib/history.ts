import { client } from './utils';

export interface HistoryWrapper {
  g(to: string, replace?: boolean): void;
  s(fn: (e: HashChangeEvent | PopStateEvent) => any): void;
}

/**
 * Create a history wrapper for hash mode or HTML5 history mode.
 * The returned value must be provided to `history` prop of `Router` component.
 *
 * _**The returned value should not be used directly. It can be changed at
 * ANY TIME without NOTICE.**_
 *
 * @param base Optional base to provide. This needs to be set if the application
 * is served under nested pathname. @default ''
 * @param hash Use hash mode. @default false
 */
export function createHistory(
  base?: string,
  hash: boolean = false,
): HistoryWrapper {
  base = normalize_base(base);

  return {
    /** go */ g(to, replace = false) {
      if (replace) {
        history.replaceState(null, '', base + to);
      } else {
        history.pushState(null, '', base + to);
      }
    },
    /** start */ s(fn) {
      window.addEventListener(hash ? 'hashchange' : 'popstate', fn);
    },
  };
}

function normalize_base(base?: string) {
  if (!base) {
    if (client) {
      const url = document.querySelector('base')?.getAttribute('href');
      base = url ? new URL(url).pathname : '';
    } else {
      base = '';
    }
  }
  return base.replace(/\/$/, '');
}
