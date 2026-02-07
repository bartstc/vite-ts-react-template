import { type PropsWithChildren, useRef } from "react";

import { type AuthStore, initializeAuthStore, Provider } from "./auth-store";

const AuthProvider = ({ children, ...props }: PropsWithChildren) => {
  const storeRef = useRef<AuthStore>(null);

  storeRef.current ??= initializeAuthStore(props);

  return <Provider value={storeRef.current}>{children}</Provider>;
};

export { AuthProvider };
