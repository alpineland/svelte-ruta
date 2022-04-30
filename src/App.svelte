<script>
  import { RouterLink, RouterView } from './lib/mod';
</script>

<main>
  <RouterLink to="/">Home</RouterLink>
  <RouterLink to="/about">About</RouterLink>
  <RouterLink to="/123">Dynamic 123</RouterLink>
  <RouterView />
</main>
