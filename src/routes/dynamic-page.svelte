<script>
  import { route } from '../lib/mod.js';
</script>

<main>
  This is dynamic page - {$route.params.id}
  <pre>{JSON.stringify($route, null, 2)}</pre>
</main>
