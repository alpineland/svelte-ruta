import { DEV } from './constants.js';
import { navigate } from './router.js';
import { warn } from './utils.js';

/**
 * @param {HTMLAnchorElement} node
 * @param {{ replace: boolean }} params
 */
export function link(node, params) {
  const { replace } = params;
  const href = node.href;
  const target = node.target;

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
      /^(?:\/|\.\.?\/)/.test(href) // only trigger if internal links
    )
      return;

    e.preventDefault();
    navigate(href, replace);
  };

  node.addEventListener('click', onclick);

  return {
    destroy() {
      node.removeEventListener('click', onclick);
    },
  };
}
