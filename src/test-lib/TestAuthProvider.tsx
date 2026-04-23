import { type PropsWithChildren, useRef } from "react";

import {
  type AuthStore,
  initializeAuthStore,
  Provider,
} from "@/features/auth/application/auth-store";
import { UserFixture } from "@/test-lib/fixtures/user-fixture";

export const TestAuthProvider = ({
  children,
  store,
}: PropsWithChildren<{ store?: AuthStore }>) => {
  const storeRef = useRef<AuthStore>(null);

  storeRef.current ??=
    store ??
    initializeAuthStore({
      isAuthenticated: true,
      isError: false,
      state: "finished",
      user: UserFixture.toStructure(),
    });

  return <Provider value={storeRef.current}>{children}</Provider>;
};
