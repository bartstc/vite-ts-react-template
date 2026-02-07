// eslint-disable-next-line no-restricted-imports
import { useRouteError as useReactRouterError } from "react-router";

import type { AjaxError } from "@/lib/http/ajax-error";

export const useRouteError = () => {
  return useReactRouterError() as AjaxError;
};
