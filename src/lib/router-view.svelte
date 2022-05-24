<script context="module">
  const DEPTH_KEY = Symbol();
</script>

<script>
  import { internal_route } from './router.js';
  import { getContext, setContext } from 'svelte';

  /** @type {number} */
  const depth = getContext(DEPTH_KEY) || 0;

  setContext(DEPTH_KEY, depth + 1);
</script>

<!-- render default slot -->
{#await $internal_route.matched[depth].components['default']() then c}
  <svelte:component this={c.default} />
{/await}

{#each Object.keys($$slots) as name (name)}
  {#if name !== 'default'}
    {#await $internal_route.matched[depth].components[name]() then c}
      <svelte:component this={c.default} slot={name} />
    {/await}
  {/if}
{/each}
