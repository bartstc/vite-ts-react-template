import queryString from "query-string";

import { isEmpty } from "@/lib/is-empty";
import type { QueryParams } from "@/types/query-params";

export const buildUrl = <Params = QueryParams>(
  path: string,
  params?: Params
) => {
  if (isEmpty(params)) {
    return path;
  }

  return `${path}?${queryString.stringify(params ?? {}, {
    arrayFormat: "comma",
  })}`;
};
