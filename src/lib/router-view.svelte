<script>
  import { getContext, setContext } from 'svelte';
  import { internal_route } from './router.js';

  export let name = 'default';
  export let route = internal_route;

  const depth_key = Symbol();

  /** @type {number} */
  const depth = getContext(depth_key) || 0;

  setContext(depth_key, depth + 1);
</script>

<svelte:component this={component} />
