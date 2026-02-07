import type { Decorator } from "@storybook/react-vite";

import {
  initializeAuthStore,
  Provider,
} from "@/features/auth/application/auth-store";
import { UserFixture } from "@/test-lib/fixtures/user-fixture";

export const withAuth: Decorator = (story) => {
  const store = initializeAuthStore({
    isAuthenticated: true,
    isError: false,
    state: "finished",
    user: UserFixture.toStructure(),
  });

  return <Provider value={store}>{story()}</Provider>;
};
