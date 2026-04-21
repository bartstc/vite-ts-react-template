// eslint-disable-next-line boundaries/dependencies
import { useAuthStore } from "@/features/auth/application/auth-store";
import { AjaxError } from "@/lib/http/ajax-error";
import { useNavigate, useRouteError } from "@/lib/router";

import { InternalErrorResult } from "./InternalErrorResult";
import { InternalServerErrorResult } from "./InternalServerErrorResult";
import { NotFoundResult } from "./NotFoundResult";

interface IProps {
  error?: AjaxError | Error;
}

export function ErrorPageStrategy(props: IProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((store) => store.logout);
  const routeError = useRouteError();

  const error = props.error ?? routeError;

  if (error instanceof AjaxError) {
    switch (error.status) {
      case 500:
        return <InternalServerErrorResult />;
      case 401:
        void logout().then(() => navigate("/"));
        return null;
      case 403:
      case 404:
        return <NotFoundResult />;
      default:
        return <InternalErrorResult />;
    }
  }

  return <InternalErrorResult />;
}
