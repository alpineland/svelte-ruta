import type { SvelteComponent } from 'svelte';

type Lazy<T> = () => Promise<{ default: T }>;

/**
 * Options to pass when initialising router.
 * @public
 */
export interface RouterOptions {
  /**
   * The initial URL that router needs to navigate.
   * This needs to be full URL.
   */
  url: string;
  /**
   * List of routes to be added to the router.
   */
  routes: RouteRecord[];
  /**
   * Optional base URL segment. This has to start with `/`.
   *
   * @default undefined
   */
  base?: string;
  /**
   * Use hash mode.
   *
   * @default false
   */
  hash?: boolean;
  /**
   * Custom scroll function for scroll behavior.
   *
   * @default undefined
   */
  scroll?: (from, to) => boolean;
}

export type RouteRecord = RouteSingleView | RouteMultiView;

export type RouteComponent =
  | typeof SvelteComponent
  | Lazy<typeof SvelteComponent>;

interface RouteRecordBase {
  pathname: string;
  children?: RouteRecord[];
  meta?: Record<string | number | symbol, unknown>;
  redirect_from?: string;
}

/**
 * @internal
 */
export interface NormalizedRouteRecord extends RouteRecordBase {
  components: Record<string, RouteComponent>;
}

interface RouteSingleView extends RouteRecordBase {
  component: RouteComponent;
  components?: never;
}

interface RouteMultiView extends RouteRecordBase {
  components: Record<string, RouteComponent>;
  component?: never;
}
