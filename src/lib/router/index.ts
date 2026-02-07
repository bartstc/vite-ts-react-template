/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-restricted-imports */

import {
  useLocation,
  generatePath as reactRouterGeneratePath,
  useNavigate as reactRouterUseNavigate,
  type NavigateOptions,
} from "react-router";

import type { RoutePath } from "@/lib/router/route-path";

export {
  Link,
  Navigate,
  Outlet,
  createSearchParams,
  useLocation,
  useNavigation,
  useParams,
  useSearchParams,
  matchPath,
  type LoaderFunctionArgs,
} from "react-router";
export { useRouteError } from "./use-route-error";
export { handleLazyImportError } from "./handle-lazy-import-error";

export const useLocationState = () => useLocation().state ?? {};

export const generatePath = (
  path: string,
  params: Record<string, string | undefined>
) => {
  const defaultParams = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, value ?? ""])
  );
  return reactRouterGeneratePath(path, defaultParams);
};

type ExtractRouteParams<T extends string> =
  T extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<Rest>
    : T extends `${infer _Start}:${infer Param}`
      ? Param
      : never;

export type PathParams<Path extends string> = Record<
  ExtractRouteParams<Path>,
  string | undefined
>;

interface NavigateConfig<Path extends RoutePath> {
  path: Path | string;
  params?: PathParams<Path>;
  search?: string;
}

export function useNavigate() {
  const navigate = reactRouterUseNavigate();

  function typedNavigate<Path extends RoutePath>(
    pathOrConfig: string | NavigateConfig<Path>,
    options?: NavigateOptions
  ): ReturnType<typeof navigate> {
    if (typeof pathOrConfig === "string") {
      return navigate(pathOrConfig, options);
    }

    const { path, params, search } = pathOrConfig;

    let result: string = path;
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        result = result.replace(`:${key}`, value as string);
      }
    }

    return navigate({ pathname: result, search }, options);
  }

  return typedNavigate;
}
