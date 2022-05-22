<script>
  import { RouterView, set_router, link } from './lib/mod.js';
  import { router } from './router.js';

  set_router(router);
</script>

<main>
  <a href="/" use:link>Home</a>
  <a href="/about" use:link>About</a>
  <a href="/123" use:link>Dynamic 123</a>
  <RouterView />
</main>
