import { isEmpty } from "lodash-es";
import queryString from "query-string";

import { IQueryParams } from "../types";

export const buildUrl = <Params = IQueryParams>(
  path: string,
  params?: Params
) => {
  if (isEmpty(params)) {
    return path;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return `${path}?${queryString.stringify(params as any, {
    arrayFormat: "comma",
  })}`;
};
