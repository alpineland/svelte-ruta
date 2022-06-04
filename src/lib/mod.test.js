import * as svelte_ruta from './mod.js';
import { assert, test } from 'vitest';

test('test mod exports', () => {
  const exports = ['RouterView', 'ROUTER_KEY', 'Router', 'get_router', 'route'];

  assert.sameMembers(Object.keys(svelte_ruta), exports);
});
