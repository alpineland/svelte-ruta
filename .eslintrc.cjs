module.exports = {
  extends: require.resolve('@ydcjeff/configs/eslint'),
  plugins: ['svelte3'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
};
