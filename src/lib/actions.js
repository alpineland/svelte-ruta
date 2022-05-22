import { DEV } from './constants.js';
import { get_router } from './router.js';
import { warn } from './utils.js';

/**
 * @param {HTMLAnchorElement} node
 * @param {boolean} [replace] `false`
 */
export function link(node, replace) {
  const href = node.getAttribute('href');
  const target = node.target;
  const router = get_router();

  if (DEV && !href) {
    warn(`"href" should be defined, not ${href}.`);
  }

  /** @param {MouseEvent} e */
  const onclick = (e) => {
    if (
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.metaKey || // don't trigger on modifier keys
      e.button !== 0 || // only trigger left button click
      e.defaultPrevented || // don't trigger when defaultPrevented called
      /\b_blank\b/.test(target) || // don't trigger if target="_blank"
      !/^(?:\/|\.\.?\/)/.test(/** @type {string} */ (href)) // only trigger for internal links
    )
      return;

    e.preventDefault();
    router.navigate(/** @type {string} */ (href), replace);
  };

  node.addEventListener('click', onclick);

  return {
    destroy() {
      node.removeEventListener('click', onclick);
    },
  };
}
