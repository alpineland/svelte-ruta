import App from './App.svelte';
import { createHistory, createRouter } from './lib/mod';

createRouter(createHistory(), [
  {
    pathname: '/',
    component: () => import('./routes/home-page.svelte'),
  },
  {
    pathname: '/about',
    component: () => import('./routes/about-page.svelte'),
  },
  {
    pathname: '/:id',
    component: () => import('./routes/dynamic-page.svelte'),
  },
]);

new App({ target: /** @type {Element} */ (document.getElementById('app')) });
