import { merge } from "lodash-es";

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

type ExtendStructureFn<T> = (structure: T) => DeepPartial<T>;
type CreateStructure<T> = (extend?: DeepPartial<T> | ExtendStructureFn<T>) => T;

export function createStructureFactory<T>(structure: T): CreateStructure<T> {
  return (extend = {}) => {
    if (typeof extend === "function") {
      return merge({}, structure, extend(structure));
    }
    return merge({}, structure, extend);
  };
}

type ExtendCollectionFn<T> = (structure: T) => DeepPartial<T>[];
type CreateCollection<T> = (
  extend: DeepPartial<T>[] | ExtendCollectionFn<T>
) => T[];

export function createCollectionFactory<T>(structure: T): CreateCollection<T> {
  return (extend) => {
    if (typeof extend === "function") {
      return extend(structure).map((r) => merge({}, structure, r));
    }
    return extend.map((element) => merge({}, structure, element));
  };
}

export function createFixture<T>(structure: T) {
  return {
    toStructure() {
      return structure;
    },
    createPermutation: createStructureFactory(structure),
    createCollection: createCollectionFactory(structure),
  };
}
