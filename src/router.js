import { Router } from './lib/mod.js';

export const router = new Router({
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
