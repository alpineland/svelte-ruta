import App from './App.svelte';
import { createRouter, createHistory } from './lib/mod';

createRouter(createHistory(), [
  {
    pathname: '/',
    component: () => import('./routes/home_page.svelte'),
  },
  {
    pathname: '/about',
    component: () => import('./routes/about_page.svelte'),
  },
  {
    pathname: '/:id',
    component: () => import('./routes/dynamic_page.svelte'),
  },
]);

new App({ target: document.getElementById('app')! });
