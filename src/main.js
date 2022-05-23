import App from './App.svelte';
import { ROUTER_KEY, Router } from './lib/mod.js';

const router = new Router({
  routes: [
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
  ],
});

new App({
  target: /** @type {Element} */ (document.getElementById('app')),
  context: new Map([[ROUTER_KEY, router]]),
});
