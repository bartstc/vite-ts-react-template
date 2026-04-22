import type { Decorator } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: Infinity,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
    mutations: { retry: false },
  },
});

export const withReactQuery: Decorator = (story) => {
  testQueryClient.clear();

  return (
    <QueryClientProvider client={testQueryClient}>
      {story()}
    </QueryClientProvider>
  );
};
