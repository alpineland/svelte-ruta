import type { SvelteComponent } from 'svelte';

export interface RouteMeta extends Record<string | number | symbol, unknown> {}
export type RouteRecord = RouteSingleView | RouteMultiView;

type Lazy<T> = () => Promise<{ default: T }>;
type RouteComponent = typeof SvelteComponent | Lazy<typeof SvelteComponent>;

interface RouteRecordBase {
  pathname: string;
  children?: RouteRecord[];
  meta?: RouteMeta;
  redirectFrom?: string;
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
