import { InternalErrorResult } from "shared/Result";
import { useRouteError } from "shared/Router";

import { HomePage } from "./HomePage";

const HomePageError = () => {
  const error = useRouteError();

  if (error.status === 404) {
    return <HomePage fallbackProductsNumber={20} />;
  }

  return <InternalErrorResult />;
};

export { HomePageError };
