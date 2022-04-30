<script>
  import { navigate } from './router';

  /** @type {string} */
  export let to;
  export let replace = false;

  /** @param {MouseEvent} e */
  function click_handler(e) {
    // don't trigger on those keys
    if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
    // only trigger left button click
    if (e.button !== 0) return;
    // don't trigger when defaultPrevented called
    if (e.defaultPrevented) return;
    // @ts-expect-error getAttribute exists
    const target = e.currentTarget?.getAttribute('target');
    // don't trigger if target="_blank"
    if (/\b_blank\b/.test(target)) return;

    e.preventDefault();
    navigate(to, replace);
  }
</script>

<a href={to} on:click={click_handler} {...$$restProps}>
  <slot />
</a>
