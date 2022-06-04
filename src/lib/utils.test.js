import { normalise_base } from './utils.js';
import { assert, describe, test } from 'vitest';

const TEST_HOST = 'http://test.test';

describe('normalise_base', () => {
  test(TEST_HOST + '/', () => {
    assert.includeOrderedMembers(normalise_base(TEST_HOST), [TEST_HOST, '']);
  });

  test(TEST_HOST + '/test/', () => {
    assert.includeOrderedMembers(normalise_base(TEST_HOST, '/test/'), [
      TEST_HOST + '/test',
      '/test',
    ]);
  });

  test('base should start with "/"', () => {
    assert.throw(
      () => normalise_base(TEST_HOST, 'no-slash'),
      '"base" should start with "/".',
    );
  });
});
