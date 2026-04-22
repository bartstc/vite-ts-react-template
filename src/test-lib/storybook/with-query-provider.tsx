import type { Decorator } from "@storybook/react-vite";

import { TestQueryProvider } from "@/test-lib/TestQueryProvider";

export const withQueryProvider: Decorator = (story) => {
  return <TestQueryProvider>{story()}</TestQueryProvider>;
};
