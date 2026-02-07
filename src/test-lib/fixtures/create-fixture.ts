import { clone, mergeDeepRight as merge } from "ramda";

import type { DeepPartial } from "@/types/deep-partial";

type ExtendTemplateFn<T> = (template: T) => DeepPartial<T>;
type CreateTemplate<T> = (extend?: DeepPartial<T> | ExtendTemplateFn<T>) => T;

export function createTemplateFactory<T>(template: T): CreateTemplate<T> {
  return (extend = {}) => {
    if (typeof extend === "function") {
      return merge(template as object, extend(template)) as T;
    }
    return merge(template as object, extend) as T;
  };
}

type ExtendCollectionFn<T> = (template: T) => DeepPartial<T>[];
type CreateCollection<T> = (
  extend: DeepPartial<T>[] | ExtendCollectionFn<T>
) => T[];

export function createCollectionFactory<T>(template: T): CreateCollection<T> {
  return (extend) => {
    if (typeof extend === "function") {
      return extend(template).map((r) => merge(template as object, r) as T);
    }
    return extend.map((element) => merge(template as object, element) as T);
  };
}

export function createFixture<T>(template: T) {
  return {
    toStructure: () => clone(template),
    createPermutation: createTemplateFactory(template),
    createCollection: createCollectionFactory(template),
  };
}
