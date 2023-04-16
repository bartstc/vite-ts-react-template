/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserFixture } from "utils/fixtures";

// eslint-disable-next-line no-restricted-imports
import {
  initializeAuthStore,
  Provider,
} from "modules/auth/application/authStore";

export const withAuth = (story: any) => {
  const store = initializeAuthStore({
    isAuthenticated: true,
    isError: false,
    state: "finished",
    user: UserFixture.toStructure(),
  });

  return <Provider value={store}>{story()}</Provider>;
};
