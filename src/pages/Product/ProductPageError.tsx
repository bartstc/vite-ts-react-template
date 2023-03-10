import { ResourceNotFoundException } from "utils";

import { InternalErrorResult } from "shared/Result";
import { useRouteError } from "shared/Router";

import { ProductNotFoundResult } from "modules/products/presentation";

const ProductPageError = () => {
  const error = useRouteError();

  if (error instanceof ResourceNotFoundException) {
    return <ProductNotFoundResult />;
  }

  return <InternalErrorResult />;
};

export { ProductPageError };
