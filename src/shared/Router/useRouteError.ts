// eslint-disable-next-line no-restricted-imports
import { useRouteError as useReactRouterError } from "react-router-dom";

import { AjaxError } from "utils/http";

export const useRouteError = <Response = unknown>() => {
  return useReactRouterError() as AjaxError<Response>;
};
