/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line no-restricted-imports
import {
  initializeAuthStore,
  Provider,
} from "modules/auth/application/authStore";

export const withoutAuth = (story: any) => {
  const store = initializeAuthStore({
    isAuthenticated: false,
    isError: false,
    state: "finished",
  });

  return <Provider value={store}>{story()}</Provider>;
};
