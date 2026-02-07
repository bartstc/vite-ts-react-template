import { either, isNil, isEmpty as _isEmpty } from "ramda";

export const isEmpty = either(isNil, _isEmpty);
