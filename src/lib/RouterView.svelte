<script>
  import { getContext, setContext } from 'svelte';
  import { internal_route } from './router';

  export let name = 'default';

  const DEPTH_KEY = Symbol();
  /** @type {number} */
  const depth = getContext(DEPTH_KEY) || 0;

  $: component = $internal_route.matched[depth].components[name];

  setContext(DEPTH_KEY, depth + 1);
</script>

{#await component() then c}
  <svelte:component this={c.default} />
{/await}
