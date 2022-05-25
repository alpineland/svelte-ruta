<script context="module">
  const DEPTH_KEY = Symbol();
</script>

<script>
  import { internal_route } from './router.js';
  import { getContext, setContext } from 'svelte';

  export let name = 'default';

  /** @type {number} */
  const depth = getContext(DEPTH_KEY) || 0;

  setContext(DEPTH_KEY, depth + 1);

  $: component = $internal_route?.matched[depth].components[name];
</script>

{#if component}
  <svelte:component this={component} />
{/if}
