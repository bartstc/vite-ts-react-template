/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "utils";

export const withReactQuery = (story: any) => {
  queryClient.clear();

  return (
    <QueryClientProvider client={queryClient}>{story()}</QueryClientProvider>
  );
};
