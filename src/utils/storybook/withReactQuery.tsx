/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// https://github.com/TkDodo/testing-react-query/tree/main/src/tests
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export const withReactQuery = () => (story: any) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{story()}</QueryClientProvider>
  );
};
