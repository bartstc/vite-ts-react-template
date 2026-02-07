import type { Decorator } from "@storybook/react-vite";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/query";

export const withReactQuery: Decorator = (story) => {
  queryClient.clear();

  return (
    <QueryClientProvider client={queryClient}>{story()}</QueryClientProvider>
  );
};
