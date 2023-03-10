import { useRouteError as useReactRouterError } from "react-router-dom";

// eslint-disable-next-line no-restricted-imports
import { AjaxError } from "utils/http/AjaxError";

export const useRouteError = <Response = unknown>() => {
  return useReactRouterError() as AjaxError<Response>;
};
