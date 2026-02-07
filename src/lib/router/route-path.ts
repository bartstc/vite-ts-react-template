import type { routes } from "@/lib/router/routes";

type ExtractChildPaths<T, ParentPath extends string> = T extends string
  ? `${ParentPath}`
  : {
      [K in keyof T]: T[K] extends string
        ? T[K]
        : T[K] extends { path: string; children: infer C }
          ? T[K]["path"] | ExtractChildPaths<C, T[K]["path"]>
          : T[K] extends Record<string, unknown>
            ? ExtractChildPaths<T[K], ParentPath>
            : never;
    }[keyof T];

type ExtractRoutePaths<T> = T extends string
  ? T
  : T extends { path: string; children: infer C }
    ? T["path"] | ExtractChildPaths<C, T["path"]>
    : T extends Record<string, unknown>
      ? ExtractRoutePaths<T[keyof T]>
      : never;

export type RoutePath = ExtractRoutePaths<typeof routes>;
