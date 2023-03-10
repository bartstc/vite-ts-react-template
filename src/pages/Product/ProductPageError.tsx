import { ResourceNotFoundException } from "utils";

import { InternalErrorResult, NotFoundResult } from "shared/Result";
import { useRouteError } from "shared/Router";

const HomePageError = () => {
  const error = useRouteError();

  if (error instanceof ResourceNotFoundException) {
    // todo: a proper result page
    return <NotFoundResult />;
  }

  return <InternalErrorResult />;
};

export { HomePageError };
