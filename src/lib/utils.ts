export const client = typeof window !== 'undefined';

export function warn(...args: string[]): void {
  console.warn('[svelte-ruta warn]: ' + args);
}
